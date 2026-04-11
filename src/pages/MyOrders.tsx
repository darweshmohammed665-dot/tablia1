import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Order } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { motion } from 'motion/react';
import { Package, Clock, ShoppingBag, ChevronLeft, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import OrderStatusTracker from '../components/OrderStatusTracker';
import OrderTrackingMap from '../components/OrderTrackingMap';
import { onLocationUpdated } from '../services/socketService';

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [driverLocations, setDriverLocations] = useState<Record<string, { lat: number; lng: number }>>({});
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming');

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'orders'), 
      where('customerId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  const upcomingOrders = orders.filter(o => ['pending', 'preparing', 'out_for_delivery'].includes(o.status));
  const previousOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));
  const displayedOrders = activeTab === 'upcoming' ? upcomingOrders : previousOrders;

  return (
    <div className="bg-brand-cream min-h-screen py-[100px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-[56px] font-bold text-brand-accent">الطلبات</h1>
          <Link to="/meals" className="text-brand-primary font-bold flex items-center gap-2 hover:underline">
            اطلب المزيد <ChevronLeft size={20} />
          </Link>
        </div>

        <div className="flex gap-4 mb-12 border-b border-stone-200 pb-px">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`pb-4 px-4 font-bold text-lg transition-colors relative ${activeTab === 'upcoming' ? 'text-brand-primary' : 'text-stone-500 hover:text-stone-700'}`}
          >
            الطلبات القادمة
            {activeTab === 'upcoming' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-t-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('previous')}
            className={`pb-4 px-4 font-bold text-lg transition-colors relative ${activeTab === 'previous' ? 'text-brand-primary' : 'text-stone-500 hover:text-stone-700'}`}
          >
            الطلبات السابقة
            {activeTab === 'previous' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-t-full" />
            )}
          </button>
        </div>

        {displayedOrders.length > 0 ? (
          <div className="space-y-8">
            {displayedOrders.map((order, i) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                className="food-card p-8 md:p-10 relative overflow-hidden group"
              >
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-colors duration-700"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-black text-stone-400 tracking-wider">رقم الطلب: #{order.id.slice(-6).toUpperCase()}</span>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                        'bg-brand-primary/10 text-brand-primary'
                      }`}>
                        {order.status === 'pending' ? 'قيد الانتظار' : 
                         order.status === 'preparing' ? 'جاري التحضير' : 
                         order.status === 'out_for_delivery' ? 'في الطريق' :
                         order.status === 'delivered' ? 'تم التوصيل' : 'ملغي'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-brand-accent leading-tight">
                      {order.items.map(item => item.title).join('، ')}
                    </h3>
                    {order.status === 'out_for_delivery' && (
                      <button 
                        onClick={() => setTrackingOrderId(trackingOrderId === order.id ? null : order.id)}
                        className="text-sm text-brand-primary hover:underline flex items-center gap-2 w-fit mt-2"
                      >
                        <Map size={14} /> {trackingOrderId === order.id ? 'إخفاء الموقع' : 'تتبع الطلب'}
                      </button>
                    )}
                  </div>
                  <div className="text-left md:text-right bg-brand-cream p-4 rounded-2xl border border-stone-100 w-full md:w-auto">
                    <p className="text-3xl font-bold text-brand-primary mb-1">{order.total} <span className="text-sm text-stone-500 font-bold">ج.م</span></p>
                    <p className="text-xs text-stone-400 flex items-center gap-1 justify-end font-bold">
                      <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 bg-brand-cream/50 rounded-3xl p-6 md:p-8 mb-8 border border-stone-100/50">
                  <OrderStatusTracker status={order.status} />
                </div>

                <div className="pt-8 border-t border-stone-100 flex flex-wrap gap-4 relative z-10">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-brand-cream px-5 py-3 rounded-2xl border border-stone-100">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-primary shadow-sm">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-accent">{item.title}</p>
                        <p className="text-xs text-stone-500 font-bold">{item.quantity} × {item.price} ج.م</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 food-card">
            <div className="bg-brand-cream w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
              <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=200" alt="Empty Orders" className="w-full h-full object-cover rounded-full opacity-50 grayscale" />
            </div>
            <h3 className="text-2xl font-bold text-brand-accent mb-2">لا توجد طلبات</h3>
            <p className="text-stone-500 mb-8">لم تقم بأي طلبات سابقة. يمكنك تصفح الوجبات للبدء.</p>
            <Link to="/meals" className="btn-primary px-10 py-4">تصفح الوجبات</Link>
          </div>
        )}
      </div>
    </div>
  );
}

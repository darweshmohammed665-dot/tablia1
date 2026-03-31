import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Order } from '../types';
import { motion } from 'framer-motion';
import { Package, Clock, ShoppingBag, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import OrderStatusTracker from '../components/OrderStatusTracker';

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-stone-900">طلباتي</h1>
          <Link to="/meals" className="text-brand-primary font-bold flex items-center gap-2 hover:underline">
            اطلب المزيد <ChevronLeft size={20} />
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-8">
            {orders.map((order, i) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-stone-400">رقم الطلب: #{order.id.slice(-6)}</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-600' : 
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {order.status === 'pending' ? 'قيد الانتظار' : 
                         order.status === 'preparing' ? 'جاري التحضير' : 
                         order.status === 'out_for_delivery' ? 'في الطريق' :
                         order.status === 'delivered' ? 'تم التوصيل' : 'ملغي'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-stone-900">
                      {order.items.map(item => item.title).join('، ')}
                    </h3>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-2xl font-bold text-brand-primary">{order.total} ج.م</p>
                    <p className="text-sm text-stone-400 flex items-center gap-1 justify-end">
                      <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>

                <OrderStatusTracker status={order.status} />

                <div className="mt-8 pt-8 border-t border-stone-100 flex flex-wrap gap-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400 border border-stone-100">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900">{item.title}</p>
                        <p className="text-xs text-stone-500">{item.quantity} × {item.price} ج.م</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-stone-100">
            <div className="bg-stone-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">لا توجد طلبات بعد</h3>
            <p className="text-stone-500 mb-8">لم تقم بإجراء أي طلبات حتى الآن.</p>
            <Link to="/meals" className="btn-primary px-10 py-4">ابدأ التسوق الآن</Link>
          </div>
        )}
      </div>
    </div>
  );
}

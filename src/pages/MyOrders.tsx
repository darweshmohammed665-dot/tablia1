import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Order, UserProfile } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { motion } from 'motion/react';
import { Package, Clock, ShoppingBag, ChevronLeft, Map, User, Settings, Edit3, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import OrderStatusTracker from '../components/OrderStatusTracker';
import OrderTrackingMap from '../components/OrderTrackingMap';
import Chat from '../components/Chat';
import { onLocationUpdated } from '../services/socketService';

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [chatOrderId, setChatOrderId] = useState<string | null>(null);
  const [chatRecipient, setChatRecipient] = useState<string>('');
  const [driverLocations, setDriverLocations] = useState<Record<string, { lat: number; lng: number }>>({});
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming');

  useEffect(() => {
    if (!auth?.currentUser || !db) {
      setLoading(false);
      return;
    }

    // Fetch User Profile
    const fetchProfile = async () => {
      if (!db) return;
      try {
        const docRef = doc(db, 'users', auth.currentUser!.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchProfile();

    // Fetch Orders
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
      <div className="min-h-screen flex items-center justify-center bg-brand-peach">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  const upcomingOrders = orders.filter(o => ['pending', 'preparing', 'out_for_delivery'].includes(o.status));
  const previousOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));
  const displayedOrders = activeTab === 'upcoming' ? upcomingOrders : previousOrders;

  return (
    <div className="bg-brand-peach min-h-screen pb-[100px]">
      {/* Professional Profile Header */}
      <div className="bg-brand-secondary text-white pt-[120px] pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-brand-peach rounded-full border-4 border-white/20 flex items-center justify-center text-brand-secondary overflow-hidden shadow-xl shrink-0">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="opacity-50" />
              )}
            </div>
            <div className="text-center md:text-right flex-grow">
              <h1 className="text-3xl md:text-4xl font-black mb-2">{userProfile?.displayName || auth.currentUser?.displayName || 'عميل مميز'}</h1>
              <p className="text-brand-accent/80 flex items-center justify-center md:justify-start gap-2">
                {auth.currentUser?.email}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 backdrop-blur-sm">
                <Edit3 size={18} /> تعديل الحساب
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-100 text-center">
            <div className="text-brand-primary mb-2 flex justify-center"><ShoppingBag size={28} /></div>
            <p className="text-3xl font-black text-brand-secondary">{orders.length}</p>
            <p className="text-sm font-bold text-stone-500">إجمالي الطلبات</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-100 text-center">
            <div className="text-green-500 mb-2 flex justify-center"><Package size={28} /></div>
            <p className="text-3xl font-black text-brand-secondary">{previousOrders.length}</p>
            <p className="text-sm font-bold text-stone-500">طلبات مكتملة</p>
          </div>
          <div className="bg-brand-primary p-6 rounded-2xl shadow-lg border border-brand-primary text-center text-white md:col-span-2 flex flex-col justify-center items-center">
            <p className="text-lg font-bold mb-1">جاهز لطلب جديد؟</p>
            <Link to="/meals" className="bg-white text-brand-primary px-6 py-2 rounded-full font-black text-sm hover:scale-105 transition-transform">
              تصفح الأكلات الآن
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-brand-secondary">سجل الطلبات</h2>
        </div>

        <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-stone-100 w-fit">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`py-2 px-6 font-bold rounded-xl transition-all ${activeTab === 'upcoming' ? 'bg-brand-primary text-white shadow-md' : 'text-stone-500 hover:text-brand-secondary hover:bg-stone-50'}`}
          >
            الطلبات الحالية
          </button>
          <button 
            onClick={() => setActiveTab('previous')}
            className={`py-2 px-6 font-bold rounded-xl transition-all ${activeTab === 'previous' ? 'bg-brand-secondary text-white shadow-md' : 'text-stone-500 hover:text-brand-secondary hover:bg-stone-50'}`}
          >
            الطلبات السابقة
          </button>
        </div>

        {displayedOrders.length > 0 ? (
          <div className="space-y-6">
            {displayedOrders.map((order, i) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-stone-400 bg-stone-100 px-3 py-1 rounded-full">#{order.id.slice(-6).toUpperCase()}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
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
                    <h3 className="text-xl font-bold text-brand-secondary">
                      {order.items.map(item => item.title).join('، ')}
                    </h3>
                    {order.status === 'out_for_delivery' && (
                      <button 
                        onClick={() => setTrackingOrderId(trackingOrderId === order.id ? null : order.id)}
                        className="text-sm text-brand-primary hover:underline flex items-center gap-2 w-fit mt-3 font-bold bg-brand-primary/5 px-4 py-2 rounded-full"
                      >
                        <Map size={16} /> {trackingOrderId === order.id ? 'إخفاء الخريطة' : 'تتبع السائق على الخريطة'}
                      </button>
                    )}
                    {['pending', 'preparing', 'out_for_delivery'].includes(order.status) && (
                      <button 
                        onClick={() => {
                          setChatOrderId(order.id);
                          setChatRecipient('الشيف');
                        }}
                        className="text-sm text-brand-secondary hover:underline flex items-center gap-2 w-fit mt-3 font-bold bg-brand-secondary/5 px-4 py-2 rounded-full"
                      >
                        <MessageCircle size={16} /> محادثة مع الشيف
                      </button>
                    )}
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-2xl font-black text-brand-primary mb-1">{order.total} <span className="text-sm text-stone-500">ج.م</span></p>
                    <p className="text-xs text-stone-400 flex items-center gap-1 justify-end font-bold">
                      <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>

                {trackingOrderId === order.id && (
                  <div className="mb-8 rounded-2xl overflow-hidden border border-stone-200">
                    <OrderTrackingMap orderId={order.id} />
                  </div>
                )}

                <div className="bg-stone-50 rounded-2xl p-6 mb-6 border border-stone-100">
                  <OrderStatusTracker status={order.status} />
                </div>

                <div className="pt-6 border-t border-stone-100 flex flex-wrap gap-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-stone-100 shadow-sm">
                      <div className="w-8 h-8 bg-brand-peach rounded-lg flex items-center justify-center text-brand-primary">
                        <Package size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-secondary">{item.title}</p>
                        <p className="text-xs text-stone-500 font-bold">{item.quantity} × {item.price} ج.م</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[32px] border border-stone-100 shadow-sm">
            <div className="bg-brand-peach w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-2xl font-black text-brand-secondary mb-2">لا توجد طلبات هنا</h3>
            <p className="text-stone-500 mb-8 font-medium">لم تقم بأي طلبات في هذا القسم بعد.</p>
            <Link to="/meals" className="btn-primary px-10 py-4 shadow-lg shadow-brand-primary/20">تصفح الأكلات الآن</Link>
          </div>
        )}
      </div>

      <Chat 
        orderId={chatOrderId || ''} 
        recipientName={chatRecipient} 
        isOpen={!!chatOrderId} 
        onClose={() => setChatOrderId(null)} 
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Order, UserProfile } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, Clock, ShoppingBag, ChevronLeft, Map, User, 
  Settings, Edit3, MessageCircle, Heart, MapPin, Phone, 
  CreditCard, Bell, Shield, LogOut, Camera, Save
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import OrderStatusTracker from '../components/OrderStatusTracker';
import OrderTrackingMap from '../components/OrderTrackingMap';
import Chat from '../components/Chat';
import { toast } from 'sonner';

interface CustomerDashboardProps {
  profile: UserProfile;
}

export default function CustomerDashboard({ profile: initialProfile }: CustomerDashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview');
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [chatOrderId, setChatOrderId] = useState<string | null>(null);
  const [chatRecipient, setChatRecipient] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    phoneNumber: '',
    address: '',
    location: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.currentUser || !db) {
      setLoading(false);
      return;
    }

    // Fetch Profile (keep it for real-time updates if needed, but we have initialProfile)
    const unsubProfile = onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as UserProfile;
        setProfile(data);
        setEditForm({
          displayName: data.displayName || '',
          phoneNumber: data.phoneNumber || '',
          address: data.address || '',
          location: data.location || ''
        });
      }
    });

    // Set initial form values from prop
    setEditForm({
      displayName: initialProfile.displayName || '',
      phoneNumber: initialProfile.phoneNumber || '',
      address: initialProfile.address || '',
      location: initialProfile.location || ''
    });

    // Fetch Orders
    const q = query(
      collection(db, 'orders'), 
      where('customerId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeOrders = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => {
      unsubProfile();
      unsubscribeOrders();
    };
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth?.currentUser || !db) return;

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), editForm);
      toast.success('تم تحديث الملف الشخصي بنجاح');
      setIsEditing(false);
    } catch (error) {
      toast.error('فشل تحديث الملف الشخصي');
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  const activeOrders = orders.filter(o => ['pending', 'preparing', 'out_for_delivery'].includes(o.status));

  return (
    <div className="bg-brand-cream min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-brand-secondary pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-brand-peach rounded-[40px] border-4 border-white/20 flex items-center justify-center text-brand-secondary overflow-hidden shadow-2xl shrink-0 transition-transform group-hover:scale-105 duration-500">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={64} className="opacity-30" />
                )}
              </div>
              <button className="absolute -bottom-2 -right-2 bg-brand-primary text-white p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform">
                <Camera size={20} />
              </button>
            </div>
            
            <div className="text-center md:text-right flex-grow">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                  أهلاً، {profile?.displayName?.split(' ')[0] || 'يا بطل'} 👋
                </h1>
                <span className="bg-brand-primary text-white px-4 py-1 rounded-full text-sm font-bold w-fit mx-auto md:mx-0">
                  عميل ذهبي
                </span>
              </div>
              <p className="text-brand-accent/70 text-xl font-medium max-w-2xl">
                مستعد لطلب أكل بيتي النهاردة؟ عندنا شيفات طنطا مستنيينك.
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleLogout}
                className="bg-white/10 hover:bg-red-500/20 text-white p-4 rounded-2xl transition-all backdrop-blur-md border border-white/10"
                title="تسجيل الخروج"
              >
                <LogOut size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        {/* Navigation Tabs */}
        <div className="bg-white p-2 rounded-[32px] shadow-xl border border-stone-100 flex gap-2 mb-12 w-fit mx-auto md:mx-0">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: ShoppingBag },
            { id: 'orders', label: 'طلباتي', icon: Package },
            { id: 'settings', label: 'الإعدادات', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-4 rounded-[24px] font-black text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-105' 
                  : 'text-stone-400 hover:text-brand-secondary hover:bg-stone-50'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-100 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="text-brand-primary mb-6 bg-brand-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center">
                    <ShoppingBag size={32} />
                  </div>
                  <p className="text-4xl font-black text-brand-secondary mb-2">{orders.length}</p>
                  <p className="text-stone-500 font-bold">إجمالي الطلبات</p>
                </div>
                
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-100 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="text-green-500 mb-6 bg-green-500/10 w-14 h-14 rounded-2xl flex items-center justify-center">
                    <CreditCard size={32} />
                  </div>
                  <p className="text-4xl font-black text-brand-secondary mb-2">
                    {orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.total, 0)} <span className="text-sm">ج.م</span>
                  </p>
                  <p className="text-stone-500 font-bold">إجمالي المدفوعات</p>
                </div>

                <div className="bg-brand-primary p-8 rounded-[40px] shadow-xl text-white relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="mb-6 bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center">
                    <Heart size={32} />
                  </div>
                  <p className="text-4xl font-black mb-2">12</p>
                  <p className="text-white/80 font-bold">أكلات مفضلة</p>
                </div>
              </div>

              {/* Active Orders Section */}
              {activeOrders.length > 0 && (
                <div>
                  <h2 className="text-3xl font-black text-brand-secondary mb-8 flex items-center gap-4">
                    <div className="w-2 h-8 bg-brand-primary rounded-full"></div>
                    طلبات جارية الآن
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    {activeOrders.map((order) => (
                      <div key={order.id} className="bg-white rounded-[40px] p-8 shadow-lg border border-brand-primary/10">
                        <div className="flex flex-col lg:flex-row justify-between gap-8">
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="bg-brand-primary/10 text-brand-primary px-4 py-1 rounded-full text-xs font-black">
                                #{order.id.slice(-6).toUpperCase()}
                              </span>
                              <span className="animate-pulse flex items-center gap-2 text-brand-primary text-sm font-bold">
                                <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                                {order.status === 'pending' ? 'بانتظار الموافقة' : 
                                 order.status === 'preparing' ? 'يتم التحضير الآن' : 'في الطريق إليك'}
                              </span>
                            </div>
                            <h3 className="text-2xl font-black text-brand-secondary mb-6">
                              {order.items.map(i => i.title).join(' + ')}
                            </h3>
                            <OrderStatusTracker status={order.status} />
                          </div>
                          
                          <div className="lg:w-72 flex flex-col gap-3">
                            <button 
                              onClick={() => setTrackingOrderId(trackingOrderId === order.id ? null : order.id)}
                              className="w-full bg-brand-secondary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-secondary/90 transition-all"
                            >
                              <Map size={20} /> تتبع السائق
                            </button>
                            <button 
                              onClick={() => {
                                setChatOrderId(order.id);
                                setChatRecipient('الشيف');
                              }}
                              className="w-full bg-brand-peach text-brand-secondary py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-peach/80 transition-all"
                            >
                              <MessageCircle size={20} /> محادثة الشيف
                            </button>
                          </div>
                        </div>
                        
                        {trackingOrderId === order.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-8 rounded-[32px] overflow-hidden border border-stone-100"
                          >
                            <OrderTrackingMap orderId={order.id} />
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-stone-100 hover:shadow-md transition-all group">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex gap-6 items-center">
                        <div className="w-20 h-20 bg-brand-peach rounded-2xl flex items-center justify-center text-brand-primary shrink-0">
                          <Package size={32} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-400 mb-1">#{order.id.slice(-6).toUpperCase()}</p>
                          <h3 className="text-xl font-black text-brand-secondary mb-2">
                            {order.items.map(i => i.title).join('، ')}
                          </h3>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                              'bg-brand-primary/10 text-brand-primary'
                            }`}>
                              {order.status === 'delivered' ? 'تم التوصيل' : 
                               order.status === 'cancelled' ? 'ملغي' : 'نشط'}
                            </span>
                            <span className="text-xs text-stone-400 font-bold flex items-center gap-1">
                              <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                        <p className="text-3xl font-black text-brand-primary mb-1">{order.total} <span className="text-sm text-stone-500">ج.م</span></p>
                        <Link to={`/meal/${order.items[0].mealId}`} className="text-xs font-bold text-brand-secondary hover:underline">
                          طلب مرة أخرى
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 bg-white rounded-[40px] border border-stone-100 shadow-sm">
                  <div className="bg-brand-peach w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary">
                    <ShoppingBag size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-brand-secondary mb-2">لا توجد طلبات بعد</h3>
                  <p className="text-stone-500 mb-8 font-medium">ابدأ أول رحلة طعام بيتي النهاردة!</p>
                  <Link to="/meals" className="btn-primary px-12 py-4 shadow-xl">تصفح الأكلات</Link>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Profile Edit */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-stone-100">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-black text-brand-secondary">المعلومات الشخصية</h2>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-brand-primary font-bold flex items-center gap-2 hover:underline"
                    >
                      {isEditing ? 'إلغاء' : <><Edit3 size={18} /> تعديل</>}
                    </button>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-500 mr-2">الاسم بالكامل</label>
                        <div className="relative">
                          <User className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                          <input 
                            type="text"
                            disabled={!isEditing}
                            value={editForm.displayName}
                            onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                            className="w-full pr-12 pl-4 py-4 rounded-2xl border border-stone-100 bg-stone-50 focus:bg-white focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all disabled:opacity-50"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-500 mr-2">رقم الهاتف</label>
                        <div className="relative">
                          <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                          <input 
                            type="tel"
                            disabled={!isEditing}
                            value={editForm.phoneNumber}
                            onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                            className="w-full pr-12 pl-4 py-4 rounded-2xl border border-stone-100 bg-stone-50 focus:bg-white focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-stone-500 mr-2">العنوان بالتفصيل</label>
                      <div className="relative">
                        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                        <input 
                          type="text"
                          disabled={!isEditing}
                          value={editForm.address}
                          onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                          className="w-full pr-12 pl-4 py-4 rounded-2xl border border-stone-100 bg-stone-50 focus:bg-white focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all disabled:opacity-50"
                          placeholder="مثال: شارع البحر، برج مكة، الدور الرابع"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <motion.button 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        type="submit"
                        className="w-full btn-primary py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20"
                      >
                        <Save size={20} /> حفظ التغييرات
                      </motion.button>
                    )}
                  </form>
                </div>
              </div>

              {/* Sidebar Settings */}
              <div className="space-y-6">
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-stone-100">
                  <h3 className="font-black text-brand-secondary mb-6">تفضيلات الحساب</h3>
                  <div className="space-y-2">
                    {[
                      { icon: Bell, label: 'الإشعارات', color: 'text-blue-500' },
                      { icon: CreditCard, label: 'طرق الدفع', color: 'text-green-500' },
                      { icon: Shield, label: 'الأمان والخصوصية', color: 'text-purple-500' },
                    ].map((item, i) => (
                      <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-stone-50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className={`${item.color} bg-current/10 p-2 rounded-xl`}>
                            <item.icon size={20} />
                          </div>
                          <span className="font-bold text-stone-600 group-hover:text-brand-secondary transition-colors">{item.label}</span>
                        </div>
                        <ChevronLeft size={18} className="text-stone-300 group-hover:text-brand-primary transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 rounded-[40px] p-8 border border-red-100">
                  <h3 className="font-black text-red-600 mb-2">منطقة الخطر</h3>
                  <p className="text-red-600/60 text-sm mb-6 font-medium">حذف الحساب سيؤدي لمسح كل بياناتك وطلباتك نهائياً.</p>
                  <button className="w-full py-3 rounded-2xl border-2 border-red-200 text-red-600 font-black hover:bg-red-600 hover:text-white transition-all">
                    حذف الحساب
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

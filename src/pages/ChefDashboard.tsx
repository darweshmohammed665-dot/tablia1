import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Meal, UserProfile, Order } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Package, DollarSign, Star, Utensils, Settings, Clock, ChevronDown, UserCheck, MapPin, Phone } from 'lucide-react';
import OrderStatusTracker from '../components/OrderStatusTracker';
import ChefProfileForm from '../components/ChefProfileForm';

interface ChefDashboardProps {
  profile: UserProfile;
}

export default function ChefDashboard({ profile }: ChefDashboardProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'preparing' | 'out_for_delivery'>('all');
  const [isProfileComplete, setIsProfileComplete] = useState(!!(profile.bio && profile.location && profile.photoURL));
  
  // New Meal Form
  const [newMeal, setNewMeal] = useState({
    title: '',
    description: '',
    price: 0,
    category: 'محاشي',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    featured: false
  });

  useEffect(() => {
    if (!auth.currentUser) return;

    // Real-time Orders Listener
    const ordersQ = query(collection(db, 'orders'), where('chefId', '==', auth.currentUser.uid));
    const unsubscribeOrders = onSnapshot(ordersQ, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      setLoading(false);
    });

    // Fetch Chef's Meals (one-time is fine, or could be snapshot too)
    const fetchMeals = async () => {
      const mealsQ = query(collection(db, 'meals'), where('chefId', '==', auth.currentUser!.uid));
      const mealsSnap = await getDocs(mealsQ);
      setMeals(mealsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meal)));
    };

    fetchMeals();

    return () => unsubscribeOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingOrderId(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      const mealData = {
        ...newMeal,
        chefId: auth.currentUser.uid,
        chefName: auth.currentUser.displayName || 'شيف طبلية',
        rating: 5.0,
        reviewsCount: 0,
        orderCount: 0,
        available: true,
        createdAt: Date.now()
      };

      const docRef = await addDoc(collection(db, 'meals'), mealData);
      setMeals([...meals, { id: docRef.id, ...mealData } as Meal]);
      setShowAddModal(false);
      setNewMeal({ title: '', description: '', price: 0, category: 'محاشي', image: '', featured: false });
    } catch (error) {
      console.error("Error adding meal:", error);
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الوجبة؟')) return;
    try {
      await deleteDoc(doc(db, 'meals', id));
      setMeals(meals.filter(m => m.id !== id));
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  const handleToggleFeatured = async (meal: Meal) => {
    try {
      await updateDoc(doc(db, 'meals', meal.id), { featured: !meal.featured });
      setMeals(meals.map(m => m.id === meal.id ? { ...m, featured: !m.featured } : m));
    } catch (error) {
      console.error("Error toggling featured status:", error);
    }
  };

  const stats = [
    { label: 'إجمالي المبيعات', value: `${orders.reduce((acc, o) => acc + o.total, 0)} ج.م`, icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'الطلبات النشطة', value: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'عدد الوجبات', value: meals.length, icon: Utensils, color: 'bg-orange-50 text-orange-600' },
    { label: 'التقييم العام', value: '4.9', icon: Star, color: 'bg-yellow-50 text-yellow-600' },
  ];

  const statusOptions: { value: Order['status'], label: string }[] = [
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'preparing', label: 'جاري التحضير' },
    { value: 'out_for_delivery', label: 'في الطريق' },
    { value: 'delivered', label: 'تم التوصيل' },
    { value: 'cancelled', label: 'إلغاء الطلب' },
  ];

  if (!isProfileComplete) {
    return (
      <div className="bg-brand-cream min-h-screen py-[100px] px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <div className="w-20 h-20 bg-brand-secondary/10 text-brand-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <UserCheck size={40} />
            </div>
            <h1 className="text-4xl font-bold text-stone-900 mb-2">أهلاً بك في طبلية</h1>
            <p className="text-stone-500">قبل أن تبدأ في إضافة وجباتك، نحتاج منك إكمال ملفك الشخصي ليتمكن العملاء من التعرف عليك.</p>
          </div>
          <ChefProfileForm profile={profile} onComplete={() => setIsProfileComplete(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen py-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-[56px] font-bold text-brand-accent mb-2">لوحة التحكم</h1>
            <p className="text-stone-500 text-xl">أهلاً بك يا شيف، إليك ملخص نشاطك اليوم</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} /> إضافة وجبة جديدة
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="food-card p-[20px]">
              <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <p className="text-stone-500 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Management */}
          <div className="lg:col-span-2">
            <div className="food-card p-[20px] mb-8">
              <h2 className="text-2xl font-bold text-brand-accent mb-8 flex items-center gap-2">
                <Utensils size={24} className="text-brand-primary" /> قائمة أكلاتك
              </h2>
              
              <div className="space-y-6">
                {meals.length > 0 ? meals.map((meal) => (
                  <div key={meal.id} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-brand-cream transition-colors border border-transparent hover:border-stone-100">
                    <img src={meal.image} alt={meal.title} className="w-24 h-24 rounded-xl object-cover shadow-sm" />
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-stone-900">{meal.title}</h3>
                        {meal.featured && <span className="bg-brand-accent/20 text-brand-accent text-[10px] px-2 py-0.5 rounded-full font-bold">مميز</span>}
                      </div>
                      <p className="text-stone-500 text-sm mb-2">{meal.category}</p>
                      <p className="text-brand-primary font-bold">{meal.price} ج.م</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleToggleFeatured(meal)}
                        className={`p-2 transition-colors ${meal.featured ? 'text-brand-accent' : 'text-stone-400 hover:text-brand-accent'}`}
                        title={meal.featured ? "إزالة من المميز" : "تمييز الوجبة"}
                      >
                        <Star size={20} className={meal.featured ? 'fill-brand-accent' : ''} />
                      </button>
                      <button className="p-2 text-stone-400 hover:text-brand-secondary transition-colors">
                        <Settings size={20} />
                      </button>
                      <button 
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 text-stone-400">
                    لا توجد وجبات في قائمتك بعد. ابدأ بإضافة أول وجبة!
                  </div>
                )}
              </div>
            </div>

            {/* Active Orders with Tracking */}
            <div className="food-card p-[20px]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-brand-accent flex items-center gap-2">
                  <Package size={24} className="text-brand-secondary" /> إدارة الطلبات النشطة
                </h2>
                <div className="flex items-center gap-2 bg-brand-cream p-1 rounded-full border border-stone-100">
                  {['all', 'pending', 'preparing', 'out_for_delivery'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setOrderFilter(s as any)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        orderFilter === s 
                        ? 'bg-white text-brand-secondary shadow-sm' 
                        : 'text-stone-400 hover:text-stone-600'
                      }`}
                    >
                      {s === 'all' ? 'الكل' : statusOptions.find(opt => opt.value === s)?.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-8">
                {orders.filter(o => 
                  o.status !== 'delivered' && 
                  o.status !== 'cancelled' && 
                  (orderFilter === 'all' || o.status === orderFilter)
                ).length > 0 ? 
                  orders.filter(o => 
                    o.status !== 'delivered' && 
                    o.status !== 'cancelled' && 
                    (orderFilter === 'all' || o.status === orderFilter)
                  ).map((order) => (
                  <div key={order.id} className="p-6 rounded-[2rem] bg-brand-cream border border-stone-100">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-xs font-bold text-stone-400 block mb-1">رقم الطلب: #{order.id.slice(-6)}</span>
                        <h3 className="font-bold text-lg text-stone-900">
                          {order.items.map(i => i.title).join('، ')}
                        </h3>
                        <div className="mt-2 space-y-1">
                          <div className="bg-white/50 rounded-xl p-3 mb-3">
                            <p className="text-xs text-stone-400 mb-2 font-bold uppercase tracking-wider">الأصناف المطلوبة:</p>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm py-1 border-b border-stone-100 last:border-0">
                                <span className="text-stone-700">{item.quantity}x {item.title}</span>
                                <span className="text-stone-500 font-bold">{item.price * item.quantity} ج.م</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm text-stone-600 font-bold flex items-center gap-2">
                              العميل: {order.customerName}
                            </p>
                            <p className="text-sm text-stone-500 flex items-center gap-2">
                              <MapPin size={14} className="text-stone-400" /> {order.customerAddress}
                            </p>
                            <a href={`tel:${order.customerPhone}`} className="text-sm text-brand-secondary hover:underline flex items-center gap-2 w-fit">
                              <Phone size={14} /> {order.customerPhone}
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="relative group">
                        <select 
                          value={order.status}
                          disabled={updatingOrderId === order.id}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order['status'])}
                          className="appearance-none bg-white border border-stone-200 rounded-full px-6 py-2 pr-10 font-bold text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 cursor-pointer disabled:opacity-50"
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-secondary pointer-events-none" />
                      </div>
                    </div>

                    <OrderStatusTracker status={order.status} />

                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-stone-200">
                      <div className="flex items-center gap-2 text-stone-500 text-sm">
                        <Clock size={16} />
                        <span>تم الطلب: {new Date(order.createdAt).toLocaleTimeString('ar-EG')}</span>
                      </div>
                      <span className="font-bold text-xl text-brand-primary">{order.total} ج.م</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 text-stone-400">
                    لا توجد طلبات نشطة حالياً.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent History */}
          <div className="lg:col-span-1">
            <div className="food-card p-[20px]">
              <h2 className="text-2xl font-bold text-brand-accent mb-8 flex items-center gap-2">
                <Clock size={24} className="text-stone-400" /> سجل الطلبات المكتملة
              </h2>
              
              <div className="space-y-6">
                {orders.filter(o => o.status === 'delivered' || o.status === 'cancelled').length > 0 ? 
                  orders.filter(o => o.status === 'delivered' || o.status === 'cancelled').map((order) => (
                  <div key={order.id} className="p-4 rounded-2xl bg-brand-cream border border-stone-100 opacity-75">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-stone-400">#{order.id.slice(-6)}</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {order.status === 'delivered' ? 'تم التوصيل' : 'ملغي'}
                      </span>
                    </div>
                    <div className="mb-3">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-sm text-stone-700">{item.quantity}x {item.title}</p>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-stone-200">
                      <span className="font-bold text-stone-900">{order.total} ج.م</span>
                      <span className="text-xs text-stone-400">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 text-stone-400">
                    لا يوجد سجل طلبات بعد.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">إضافة وجبة جديدة</h2>
            <form onSubmit={handleAddMeal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">اسم الوجبة</label>
                <input 
                  type="text" 
                  required 
                  value={newMeal.title}
                  onChange={(e) => setNewMeal({...newMeal, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">الوصف</label>
                <textarea 
                  required 
                  value={newMeal.description}
                  onChange={(e) => setNewMeal({...newMeal, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-primary outline-none h-24"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">السعر (ج.م)</label>
                  <input 
                    type="number" 
                    required 
                    value={newMeal.price}
                    onChange={(e) => setNewMeal({...newMeal, price: Number(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">القسم</label>
                  <select 
                    value={newMeal.category}
                    onChange={(e) => setNewMeal({...newMeal, category: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-primary outline-none"
                  >
                    {['محاشي', 'مشويات', 'مكرونات', 'حلويات', 'مخبوزات', 'أكل صحي'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">رابط الصورة</label>
                <input 
                  type="url" 
                  required 
                  value={newMeal.image}
                  onChange={(e) => setNewMeal({...newMeal, image: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="featured-meal"
                  checked={newMeal.featured}
                  onChange={(e) => setNewMeal({...newMeal, featured: e.target.checked})}
                  className="w-5 h-5 rounded border-stone-200 text-brand-primary focus:ring-brand-primary"
                />
                <label htmlFor="featured-meal" className="text-sm font-medium text-stone-700">تمييز هذه الوجبة (ستظهر في أعلى ملفك الشخصي)</label>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-grow">إضافة الوجبة</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 rounded-full font-medium text-stone-500 hover:bg-stone-100 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

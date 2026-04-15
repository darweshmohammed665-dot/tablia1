import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Meal, UserProfile, Order } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Package, DollarSign, Star, Utensils, Settings, Clock, ChevronDown, UserCheck, MapPin, Phone, Map, MessageCircle, Share2, ChefHat, X, Camera } from 'lucide-react';
import OrderStatusTracker from '../components/OrderStatusTracker';
import ChefProfileForm from '../components/ChefProfileForm';
import OrderTrackingMap from '../components/OrderTrackingMap';
import Chat from '../components/Chat';
import { toast } from 'sonner';

interface ChefDashboardProps {
  profile: UserProfile;
}

export default function ChefDashboard({ profile }: ChefDashboardProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<string | null>(null);
  const [mealToEdit, setMealToEdit] = useState<Meal | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [chatOrderId, setChatOrderId] = useState<string | null>(null);
  const [chatRecipient, setChatRecipient] = useState<string>('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'preparing' | 'out_for_delivery'>('all');
  const [categoryFilter, setCategoryFilter] = useState('الكل');
  const [isProfileComplete, setIsProfileComplete] = useState(!!(profile.bio && profile.location && profile.photoURL));
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  
  // New Meal Form
  const [newMeal, setNewMeal] = useState({
    title: '',
    description: '',
    price: 0,
    category: 'محاشي',
    image: '',
    images: [] as string[],
    orderType: 'instant' as 'instant' | 'preorder',
    featured: false
  });

  useEffect(() => {
    if (!auth?.currentUser || !db) {
      setLoading(false);
      return;
    }

    // Safety timeout to prevent stuck loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000);

    // Real-time Orders Listener
    let isInitialLoad = true;
    const ordersPath = 'orders';
    const ordersQ = query(collection(db, ordersPath), where('chefId', '==', auth.currentUser.uid));
    const unsubscribeOrders = onSnapshot(ordersQ, (snapshot) => {
      const updatedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(updatedOrders);

      if (!isInitialLoad) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const orderData = change.doc.data() as Order;
            toast.success(`طلب جديد!`, {
              description: `وصلك طلب جديد من ${orderData.customerName || 'عميل'} لوجبة ${orderData.items[0]?.title || ''}`,
              duration: 8000,
              icon: <Package className="text-brand-primary" />,
              action: {
                label: 'مشاهدة',
                onClick: () => {
                  const element = document.getElementById('orders-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }
              }
            });
            
            // Optional: Play a subtle notification sound
            try {
              const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
              audio.volume = 0.5;
              audio.play().catch(() => {}); // Ignore errors if browser blocks autoplay
            } catch (e) {
              console.error('Audio notification failed', e);
            }
          }
        });
      }

      isInitialLoad = false;
      setLoading(false);
      clearTimeout(timeoutId);
    }, (error) => {
      setLoading(false);
      clearTimeout(timeoutId);
      handleFirestoreError(error, OperationType.LIST, ordersPath);
    });

    // Real-time Meals Listener
    const mealsPath = 'meals';
    const mealsQ = query(collection(db, mealsPath), where('chefId', '==', auth.currentUser.uid));
    const unsubscribeMeals = onSnapshot(mealsQ, (snapshot) => {
      setMeals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meal)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, mealsPath);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeMeals();
      clearTimeout(timeoutId);
    };
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingOrderId(orderId);
    const path = `orders/${orderId}`;
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      if (mealToEdit) {
        const path = `meals/${mealToEdit.id}`;
        await updateDoc(doc(db, 'meals', mealToEdit.id), newMeal);
        setMeals(meals.map(m => m.id === mealToEdit.id ? { ...m, ...newMeal } : m));
        toast.success('تم تحديث الوجبة بنجاح');
      } else {
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

        const path = 'meals';
        const docRef = await addDoc(collection(db, path), mealData);
        setMeals([...meals, { id: docRef.id, ...mealData } as Meal]);
        toast.success('تم إضافة الوجبة بنجاح');
      }
      setShowAddModal(false);
      setMealToEdit(null);
      setNewMeal({ title: '', description: '', price: 0, category: 'محاشي', image: '', images: [], orderType: 'instant', featured: false });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'meals');
    }
  };

  const handleEditMeal = (meal: Meal) => {
    setMealToEdit(meal);
    setNewMeal({
      title: meal.title,
      description: meal.description || '',
      price: meal.price,
      category: meal.category,
      image: meal.image || (meal.images && meal.images[0]) || '',
      images: meal.images || (meal.image ? [meal.image] : []),
      orderType: meal.orderType || 'instant',
      featured: !!meal.featured
    });
    setShowAddModal(true);
  };

  const handleShareProfile = () => {
    const url = `${window.location.origin}/chef/${auth.currentUser?.uid}`;
    navigator.clipboard.writeText(url);
    toast.success('تم نسخ رابط مطبخك بنجاح!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + newMeal.images.length > 6) {
      toast.error('يمكنك رفع 6 صور كحد أقصى');
      return;
    }

    files.forEach((file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error('يرجى اختيار ملف صورة صالح');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          setNewMeal(prev => {
            const newImages = [...prev.images, dataUrl].slice(0, 6);
            return {
              ...prev,
              images: newImages,
              image: newImages[0] || prev.image
            };
          });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    if (e.target) {
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setNewMeal(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: newImages[0] || ''
      };
    });
  };

  const handleDeleteMeal = (id: string) => {
    setMealToDelete(id);
  };

  const confirmDelete = async () => {
    if (!mealToDelete) return;
    const path = `meals/${mealToDelete}`;
    try {
      await deleteDoc(doc(db, 'meals', mealToDelete));
      setMeals(meals.filter(m => m.id !== mealToDelete));
      setMealToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleToggleFeatured = async (meal: Meal) => {
    const path = `meals/${meal.id}`;
    try {
      await updateDoc(doc(db, 'meals', meal.id), { featured: !meal.featured });
      setMeals(meals.map(m => m.id === meal.id ? { ...m, featured: !m.featured } : m));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
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
    <div className="bg-brand-cream min-h-screen">
      {/* Dashboard Header / Hero */}
      <div className="bg-brand-secondary pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-brand-accent rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
              <div className="relative">
                <img 
                  src={profile.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.displayName}`} 
                  alt={profile.displayName} 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-2 -right-2 bg-brand-primary text-white p-2 rounded-full border-4 border-brand-secondary shadow-lg">
                  <ChefHat size={20} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-2">أهلاً بك يا شيف {profile.displayName}</h1>
                <p className="text-brand-cream/80 text-lg">إليك ملخص نشاط مطبخك اليوم</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setShowProfileEdit(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <Settings size={20} />
                تعديل الملف
              </button>
              <button 
                onClick={handleShareProfile}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <MapPin size={20} />
                رابط مطبخك
              </button>
              <button 
                onClick={() => {
                  setMealToEdit(null);
                  setNewMeal({ title: '', description: '', price: 0, category: 'محاشي', image: '', images: [], orderType: 'instant', featured: false });
                  setShowAddModal(true);
                }}
                className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus size={20} />
                إضافة وجبة
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-20">
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
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-brand-accent flex items-center gap-2">
                  <Utensils size={24} className="text-brand-primary" /> قائمة أكلاتك
                </h2>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-brand-cream border border-stone-100 rounded-full px-4 py-2 text-sm font-bold text-stone-700 outline-none"
                >
                  <option value="الكل">الكل</option>
                  {['محاشي', 'مشويات', 'مكرونات', 'حلويات', 'مخبوزات', 'أكل صحي'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-6">
                {meals.filter(m => categoryFilter === 'الكل' || m.category === categoryFilter).length > 0 ? meals.filter(m => categoryFilter === 'الكل' || m.category === categoryFilter).map((meal) => (
                  <div key={meal.id} className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl hover:bg-brand-cream transition-colors border border-transparent hover:border-stone-100">
                    <img src={meal.image} alt={meal.title} className="w-full sm:w-24 h-48 sm:h-24 rounded-xl object-cover shadow-sm" />
                    <div className="flex-grow w-full">
                      <div className="flex items-center justify-between sm:justify-start gap-2 mb-2 sm:mb-0">
                        <h3 className="font-bold text-lg text-stone-900">{meal.title}</h3>
                        {meal.featured && <span className="bg-brand-accent/20 text-brand-accent text-[10px] px-2 py-0.5 rounded-full font-bold">مميز</span>}
                      </div>
                      <p className="text-stone-500 text-sm mb-1">{meal.category}</p>
                      <p className="text-brand-primary font-bold">{meal.price} ج.م</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      <button 
                        onClick={() => handleToggleFeatured(meal)}
                        className={`p-2 transition-colors ${meal.featured ? 'text-brand-accent' : 'text-stone-400 hover:text-brand-accent'}`}
                        title={meal.featured ? "إزالة من المميز" : "تمييز الوجبة"}
                      >
                        <Star size={20} className={meal.featured ? 'fill-brand-accent' : ''} />
                      </button>
                      <button 
                        onClick={() => handleEditMeal(meal)}
                        className="p-2 text-stone-400 hover:text-brand-secondary transition-colors"
                      >
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
                    لا توجد وجبات في هذا القسم.
                  </div>
                )}
              </div>
            </div>

            {/* Active Orders with Tracking */}
            <div id="orders-section" className="food-card p-[20px]">
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
                            <button 
                              onClick={() => setTrackingOrderId(trackingOrderId === order.id ? null : order.id)}
                              className="text-sm text-brand-primary hover:underline flex items-center gap-2 w-fit mt-2 font-bold"
                            >
                              <Map size={14} /> {trackingOrderId === order.id ? 'إخفاء الموقع' : 'تتبع السائق'}
                            </button>
                            <button 
                              onClick={() => {
                                setChatOrderId(order.id);
                                setChatRecipient(order.customerName);
                              }}
                              className="text-sm text-brand-secondary hover:underline flex items-center gap-2 w-fit mt-2 font-bold"
                            >
                              <MessageCircle size={14} /> محادثة مع العميل
                            </button>
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

                    {trackingOrderId === order.id && (
                      <div className="mb-6">
                        <OrderTrackingMap orderId={order.id} />
                      </div>
                    )}

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
          <div className="lg:col-span-1 space-y-8">
            {/* Financial Info Card */}
            <div className="food-card p-[20px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-brand-accent flex items-center gap-2">
                  <DollarSign size={20} className="text-green-500" /> بيانات الدفع
                </h2>
                <button 
                  onClick={() => setShowProfileEdit(true)}
                  className="text-xs font-bold text-brand-primary hover:underline"
                >
                  تعديل
                </button>
              </div>
              
              <div className="space-y-4">
                {profile.paymentMethods?.vodafoneCash ? (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <p className="text-[10px] text-stone-400 font-bold uppercase mb-1">فودافون كاش</p>
                    <p className="text-sm font-bold text-stone-700">{profile.paymentMethods.vodafoneCash}</p>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 border-dashed">
                    <p className="text-xs text-red-400 font-medium">لم يتم إضافة فودافون كاش</p>
                  </div>
                )}

                {profile.paymentMethods?.bankName ? (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <p className="text-[10px] text-stone-400 font-bold uppercase mb-1">الحساب البنكي ({profile.paymentMethods.bankName})</p>
                    <p className="text-sm font-bold text-stone-700">{profile.paymentMethods.accountNumber}</p>
                    <p className="text-[10px] text-stone-500 mt-1">{profile.paymentMethods.accountHolderName}</p>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 border-dashed">
                    <p className="text-xs text-red-400 font-medium">لم يتم إضافة حساب بنكي</p>
                  </div>
                )}

                {profile.paymentMethods?.instapay && (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <p className="text-[10px] text-stone-400 font-bold uppercase mb-1">InstaPay</p>
                    <p className="text-sm font-bold text-stone-700">{profile.paymentMethods.instapay}</p>
                  </div>
                )}
              </div>
            </div>

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

      <Chat 
        orderId={chatOrderId || ''} 
        recipientName={chatRecipient} 
        isOpen={!!chatOrderId} 
        onClose={() => setChatOrderId(null)} 
      />

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {showProfileEdit && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
            <div className="min-h-screen py-10 w-full flex items-center justify-center">
              <ChefProfileForm 
                profile={profile} 
                onComplete={() => {
                  setShowProfileEdit(false);
                  window.location.reload(); // Reload to get fresh profile data
                }} 
                onCancel={() => setShowProfileEdit(false)}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {mealToDelete && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} />
              </div>
              <h2 className="text-3xl font-black text-stone-900 mb-4">حذف الوجبة؟</h2>
              <p className="text-stone-500 text-lg mb-10 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف هذه الوجبة؟ لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={confirmDelete}
                  className="flex-grow bg-red-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                >
                  نعم، احذفها
                </button>
                <button 
                  onClick={() => setMealToDelete(null)}
                  className="flex-grow bg-stone-100 text-stone-600 py-4 rounded-2xl font-black text-lg hover:bg-stone-200 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Meal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">{mealToEdit ? 'تعديل الوجبة' : 'إضافة وجبة جديدة'}</h2>
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
                  <label className="block text-sm font-medium text-stone-700 mb-1">نوع الطلب</label>
                  <select 
                    value={newMeal.orderType}
                    onChange={(e) => setNewMeal({...newMeal, orderType: e.target.value as 'instant' | 'preorder'})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-primary outline-none"
                  >
                    <option value="instant">فوري</option>
                    <option value="preorder">طلب يوم بيومه</option>
                  </select>
                </div>
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
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">صور الوجبة (حتى 6 صور)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newMeal.images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-200">
                      <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {newMeal.images.length < 6 && (
                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 cursor-pointer hover:bg-stone-50 hover:border-brand-primary transition-colors">
                      <Camera size={24} />
                      <span className="text-[10px] mt-1">إضافة صورة</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleImageUpload}
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>
                {newMeal.images.length === 0 && (
                  <p className="text-xs text-red-500">يرجى إضافة صورة واحدة على الأقل</p>
                )}
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
                <button type="submit" className="btn-primary flex-grow">
                  {mealToEdit ? 'حفظ التغييرات' : 'إضافة الوجبة'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddModal(false);
                    setMealToEdit(null);
                  }}
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

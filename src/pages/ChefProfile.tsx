import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { UserProfile, Meal } from '../types';
import { CHEF_IMAGE_URL } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Star, ChefHat, Clock, Edit3, UtensilsCrossed, Share2, Users, ShoppingBag } from 'lucide-react';
import ChefProfileForm from '../components/ChefProfileForm';
import { MealCard } from '../components/MealCard';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export default function ChefProfile() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [chef, setChef] = useState<UserProfile | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [popularMeals, setPopularMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = auth.currentUser?.uid === id;

  const fetchData = async () => {
    if (!id) return;
    try {
      const chefSnap = await getDoc(doc(db, 'users', id));
      if (chefSnap.exists()) {
        setChef(chefSnap.data() as UserProfile);
      }

      const mealsQ = query(collection(db, 'meals'), where('chefId', '==', id), where('available', '==', true));
      const mealsSnap = await getDocs(mealsQ);
      const allMeals = mealsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meal));
      setMeals(allMeals);

      // Calculate popular meals: featured first, then by orderCount, then by rating
      const sortedForPopular = [...allMeals].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        const orderDiff = (b.orderCount || 0) - (a.orderCount || 0);
        if (orderDiff !== 0) return orderDiff;
        return b.rating - a.rating;
      });
      setPopularMeals(sortedForPopular.slice(0, 3));
    } catch (error) {
      console.error("Error fetching chef profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div></div>;
  if (!chef) return <div className="min-h-screen flex flex-col items-center justify-center"><h2 className="text-2xl font-bold mb-4">الشيف غير موجود</h2><Link to="/chefs" className="btn-primary">العودة لسوق الطهاة</Link></div>;

  return (
    <div className="bg-brand-cream min-h-screen pb-[80px]">
      {/* Header / Cover */}
      <div className="h-64 bg-brand-secondary relative">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="food-card p-8 md:p-12 mb-[80px]">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
            <div className="relative w-40 h-40 -mt-20 md:-mt-32">
              <div className="w-full h-full rounded-full bg-brand-secondary flex items-center justify-center border-8 border-white shadow-lg overflow-hidden">
                <img 
                  src={CHEF_IMAGE_URL} 
                  alt={chef.displayName} 
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-brand-accent text-stone-900 p-2 rounded-full shadow-lg">
                <ChefHat size={20} />
              </div>
            </div>
            
            <div className="flex-grow text-center md:text-right">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <h1 className="text-[56px] font-bold text-brand-accent">{chef.displayName}</h1>
                {isOwner && (
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="p-2 bg-stone-100 text-stone-500 rounded-full hover:bg-brand-secondary hover:text-white transition-all"
                  >
                    <Edit3 size={18} />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-stone-500">
                <span className="flex items-center gap-1"><MapPin size={18} /> {chef.location || 'طنطا'}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={scrollToMenu}
                className="btn-primary px-8 flex items-center gap-2"
              >
                <UtensilsCrossed size={18} />
                عرض الأكلات
              </button>
              {!isOwner && <button className="btn-secondary px-8">متابعة</button>}
              <button className="p-4 bg-stone-100 text-stone-600 rounded-full hover:bg-stone-200 transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 py-8 border-y border-stone-100">
            <div className="text-center md:border-l border-stone-100 last:border-0">
              <div className="flex items-center justify-center gap-2 text-brand-accent mb-1">
                <Star size={24} className="fill-brand-accent" />
                <span className="text-2xl font-black">{chef.rating || '4.9'}</span>
              </div>
              <p className="text-sm text-stone-500 font-medium">متوسط التقييم</p>
            </div>
            
            <div className="text-center md:border-l border-stone-100 last:border-0">
              <div className="flex items-center justify-center gap-2 text-stone-800 mb-1">
                <Users size={24} />
                <span className="text-2xl font-black">{chef.reviewsCount || '120'}</span>
              </div>
              <p className="text-sm text-stone-500 font-medium">إجمالي التقييمات</p>
            </div>

            <div className="text-center md:border-l border-stone-100 last:border-0">
              <div className="flex items-center justify-center gap-2 text-stone-800 mb-1">
                <UtensilsCrossed size={24} />
                <span className="text-2xl font-black">{meals.length}</span>
              </div>
              <p className="text-sm text-stone-500 font-medium">وجبة متاحة</p>
            </div>

            <div className="text-center last:border-0">
              <div className="flex items-center justify-center gap-2 text-stone-800 mb-1">
                <Clock size={24} />
                <span className="text-2xl font-black">45</span>
              </div>
              <p className="text-sm text-stone-500 font-medium">دقيقة (متوسط التوصيل)</p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">عن الشيف</h2>
            <p className="text-stone-600 leading-relaxed max-w-3xl whitespace-pre-wrap text-lg">
              {chef.bio || "طاهٍ منزلي متخصص في الأكلات المصرية التقليدية. أستخدم أفضل المكونات الطازجة وأتبع أعلى معايير النظافة والجودة لضمان وجبة شهية وصحية لعائلتك."}
            </p>
          </div>
        </div>

        {/* Popular Meals Section */}
        {popularMeals.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-brand-accent p-3 rounded-2xl text-stone-900">
                <Star size={24} className="fill-stone-900" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-stone-900">أكثر الأكلات طلباً</h2>
                <p className="text-stone-500">الأكثر تميزاً وشعبية لدى زبائن الشيف</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularMeals.map((meal, i) => (
                <div key={`popular-${meal.id}`} className="relative">
                  <MealCard 
                    meal={{
                      id: meal.id,
                      title: meal.title,
                      price: meal.price,
                      image: meal.image,
                      chefId: chef.uid,
                      chefName: chef.displayName,
                      rating: meal.rating,
                      deliveryTime: 45,
                      description: meal.description
                    }}
                    index={i}
                  />
                  <div className="absolute top-4 right-4 bg-brand-accent text-stone-900 px-4 py-1 rounded-full text-sm font-black shadow-lg pointer-events-none z-20">
                    الأكثر طلباً
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        <AnimatePresence>
          {showEditModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="w-full max-w-2xl">
                <ChefProfileForm 
                  profile={chef} 
                  onComplete={() => {
                    setShowEditModal(false);
                    fetchData();
                  }} 
                  onCancel={() => setShowEditModal(false)}
                />
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Chef's Menu */}
        <div className="mb-12" ref={menuRef}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-stone-900">قائمة الأكلات</h2>
            <div className="h-1 flex-grow mx-8 bg-stone-100 rounded-full hidden md:block"></div>
          </div>

          {/* Menu Categories */}
          <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar mb-6">
            {['الكل', 'عروض لحظية', 'أطباق رئيسية', 'مشويات', 'طواجن', 'حلويات', 'مشروبات'].map((cat, i) => (
              <button 
                key={i} 
                className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${i === 0 ? 'bg-brand-primary text-white shadow-md' : 'bg-white text-stone-600 border border-stone-200 hover:border-brand-primary hover:text-brand-primary'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Choices to your taste (Horizontal Scroll) */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-stone-900 mb-6">اختيارات على ذوقك</h3>
            <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
              {meals.slice(0, 4).map((meal, i) => (
                <div key={`taste-${meal.id}`} className="min-w-[280px] bg-white rounded-3xl p-4 border border-stone-100 shadow-sm flex gap-4 items-center group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                    <img src={meal.image} alt={meal.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h4 className="font-bold text-stone-900 text-sm mb-1 line-clamp-2">{meal.title}</h4>
                    <p className="text-brand-primary font-black text-sm mb-2">{meal.price} ج.م</p>
                    <button 
                      onClick={() => {
                        addToCart({
                          id: meal.id,
                          title: meal.title,
                          price: meal.price,
                          quantity: 1,
                          image: meal.image,
                          chefId: chef.uid,
                          chefName: chef.displayName
                        });
                        toast.success(`تم إضافة ${meal.title} إلى السلة`);
                      }}
                      className="w-8 h-8 bg-brand-cream rounded-full flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all self-end"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {meals.length > 0 ? meals.map((meal, i) => (
              <div key={meal.id} className="relative">
                <MealCard 
                  meal={{
                    id: meal.id,
                    title: meal.title,
                    price: meal.price,
                    image: meal.image,
                    chefId: chef.uid,
                    chefName: chef.displayName,
                    rating: meal.rating,
                    deliveryTime: 45,
                    description: meal.description
                  }}
                  index={i}
                />
                {meal.featured && (
                  <div className="absolute top-4 right-4 bg-brand-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest pointer-events-none z-20">
                    مميز
                  </div>
                )}
              </div>
            )) : (
              <div className="col-span-full text-center py-12 text-stone-400">
                لا توجد وجبات متاحة حالياً.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Cart Bar */}
      <AnimatePresence>
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 z-50 md:hidden"
        >
          <div className="bg-brand-primary text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm opacity-90 font-medium">أضف منتجات بقيمة 50.00 ج.م لتبدأ الطلب</span>
            </div>
            <Link to="/cart" className="bg-white text-brand-primary px-6 py-2 rounded-xl font-bold text-sm">
              عرض السلة
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

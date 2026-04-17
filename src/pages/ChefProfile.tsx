import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { UserProfile, Meal, Review } from '../types';
import { CHEF_IMAGE_URL } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Star, ChefHat, Clock, Edit3, UtensilsCrossed, Share2, Users, ShoppingBag, Heart, ShieldCheck, MessageSquareQuote } from 'lucide-react';
import ChefProfileForm from '../components/ChefProfileForm';
import { MealCard } from '../components/MealCard';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export default function ChefProfile() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [chef, setChef] = useState<UserProfile | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [popularMeals, setPopularMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews'>('menu');
  const [showEditModal, setShowEditModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = auth.currentUser?.uid === id;

  const fetchData = async () => {
    if (!id || !db) {
      setLoading(false);
      return;
    }
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

      // Fetch Reviews
      const reviewsQ = query(collection(db, 'reviews'), where('chefId', '==', id), orderBy('createdAt', 'desc'));
      const reviewsSnap = await getDocs(reviewsQ);
      setReviews(reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
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
  if (!chef) return <div className="min-h-screen flex flex-col items-center justify-center"><h2 className="text-2xl font-bold mb-4 text-brand-secondary">المطبخ غير موجود</h2><Link to="/chefs" className="btn-primary">العودة لسوق المطابخ</Link></div>;

  return (
    <div className="bg-brand-peach min-h-screen pb-[80px]">
      {/* Professional Cover Header */}
      <div className="h-[280px] relative overflow-hidden bg-gradient-to-br from-brand-secondary via-brand-primary/20 to-brand-secondary">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/90 via-brand-secondary/40 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl mb-[80px] border border-stone-100"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative w-48 h-48 -mt-20 md:-mt-28 shrink-0">
              <div className="w-full h-full rounded-full bg-brand-peach flex items-center justify-center border-[8px] border-white shadow-xl overflow-hidden">
                <img 
                  src={chef.photoURL || CHEF_IMAGE_URL} 
                  alt={chef.displayName} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute bottom-4 right-4 bg-brand-primary text-white p-2.5 rounded-full shadow-lg border-2 border-white">
                <ShieldCheck size={20} />
              </div>
            </div>
            
            <div className="flex-grow text-center md:text-right pt-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                    <h1 className="text-4xl md:text-5xl font-black text-brand-secondary">{chef.displayName}</h1>
                    {isOwner && (
                      <button 
                        onClick={() => setShowEditModal(true)}
                        className="p-2 bg-brand-peach text-brand-primary rounded-full hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                        title="تعديل الملف الشخصي"
                      >
                        <Edit3 size={18} />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-stone-500 font-medium">
                    <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1 rounded-full"><MapPin size={16} className="text-brand-primary" /> {chef.location || 'طنطا'}</span>
                    <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1 rounded-full"><ChefHat size={16} className="text-brand-primary" /> طاهٍ محترف</span>
                    {chef.workingHours && (
                      <span className="flex items-center gap-1.5 bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full font-bold">
                        <Clock size={16} /> {chef.workingHours.from} - {chef.workingHours.to}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <button 
                    onClick={scrollToMenu}
                    className="btn-primary px-8 shadow-brand-primary/30"
                  >
                    <UtensilsCrossed size={18} />
                    تصفح الأكلات
                  </button>
                  {!isOwner && (
                    <button className="p-4 bg-brand-peach text-brand-primary rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-sm">
                      <Heart size={20} />
                    </button>
                  )}
                  <button className="p-4 bg-stone-50 text-stone-600 rounded-2xl hover:bg-stone-200 transition-all shadow-sm">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className="mt-6 text-stone-600 leading-relaxed max-w-3xl whitespace-pre-wrap text-lg bg-stone-50 p-6 rounded-2xl border border-stone-100">
                {chef.bio || "طاهٍ منزلي متخصص في الأكلات المصرية التقليدية. أستخدم أفضل المكونات الطازجة وأتبع أعلى معايير النظافة والجودة لضمان وجبة شهية وصحية لعائلتك."}
              </div>
            </div>
          </div>

          {/* Professional Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <div className="bg-brand-peach/50 p-6 rounded-2xl border border-brand-accent/30 text-center transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-center gap-2 text-brand-primary mb-2">
                <Star size={28} className="fill-brand-primary" />
              </div>
              <span className="text-3xl font-black text-brand-secondary block mb-1">{chef.rating || '0.0'}</span>
              <p className="text-sm text-stone-500 font-bold">متوسط التقييم</p>
            </div>
            
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 text-center transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-center gap-2 text-stone-400 mb-2">
                <Users size={28} />
              </div>
              <span className="text-3xl font-black text-brand-secondary block mb-1">{chef.reviewsCount || '0'}</span>
              <p className="text-sm text-stone-500 font-bold">إجمالي التقييمات</p>
            </div>

            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 text-center transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-center gap-2 text-stone-400 mb-2">
                <UtensilsCrossed size={28} />
              </div>
              <span className="text-3xl font-black text-brand-secondary block mb-1">{meals.length}</span>
              <p className="text-sm text-stone-500 font-bold">وجبة متاحة</p>
            </div>

            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 text-center transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-center gap-2 text-stone-400 mb-2">
                <Clock size={28} />
              </div>
              <span className="text-3xl font-black text-brand-secondary block mb-1">{meals.length > 0 ? Math.min(...meals.map(m => m.deliveryTime || 45)) : '45'}</span>
              <p className="text-sm text-stone-500 font-bold">دقيقة للتوصيل</p>
            </div>
          </div>
        </motion.div>

        {/* Popular Meals Section */}
        {popularMeals.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-brand-primary/10 p-4 rounded-2xl text-brand-primary">
                <Star size={28} className="fill-brand-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-brand-secondary">أكثر الأكلات طلباً</h2>
                <p className="text-stone-500 font-medium mt-1">الأكثر تميزاً وشعبية لدى زبائن المطبخ</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularMeals.map((meal, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={`popular-${meal.id}`} 
                  className="relative"
                >
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
                      description: meal.description,
                      orderType: meal.orderType
                    }}
                    index={i}
                  />
                  <div className="absolute top-4 right-4 bg-brand-primary text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg pointer-events-none z-20 uppercase tracking-widest">
                    الأكثر طلباً
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        <AnimatePresence>
          {showEditModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-secondary/80 backdrop-blur-sm">
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

        {/* Tab Selection */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-stone-100 flex gap-2">
            <button 
              onClick={() => setActiveTab('menu')}
              className={`px-8 py-3 rounded-xl font-black transition-all flex items-center gap-2 ${activeTab === 'menu' ? 'bg-brand-secondary text-white shadow-lg' : 'text-stone-500 hover:bg-stone-50'}`}
            >
              <UtensilsCrossed size={18} />
              قائمة الطعام
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-8 py-3 rounded-xl font-black transition-all flex items-center gap-2 ${activeTab === 'reviews' ? 'bg-brand-secondary text-white shadow-lg' : 'text-stone-500 hover:bg-stone-50'}`}
            >
              <Star size={18} />
              التقييمات ({reviews.length})
            </button>
          </div>
        </div>

        {/* Chef's Content */}
        {activeTab === 'menu' ? (
          <div className="mb-12" ref={menuRef}>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-brand-secondary flex items-center gap-3">
                <UtensilsCrossed size={32} className="text-brand-primary" />
                تصفح الأكلات
              </h2>
              <div className="h-px flex-grow mx-8 bg-stone-200 hidden md:block"></div>
            </div>

            {/* Menu Categories */}
            <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar mb-8">
              {['الكل', 'عروض لحظية', 'أطباق رئيسية', 'مشويات', 'طواجن', 'حلويات', 'مشروبات'].map((cat, i) => (
                <button 
                  key={i} 
                  className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${i === 0 ? 'bg-stone-100 text-stone-600 border border-stone-200 hover:border-brand-primary hover:text-brand-primary hover:shadow-md' : 'bg-white text-stone-600 border border-stone-200 hover:border-brand-primary hover:text-brand-primary hover:shadow-md'}`}
                >
                  {cat}
                </button>
              ))}
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
                      description: meal.description,
                      orderType: meal.orderType
                    }}
                    index={i}
                  />
                  {meal.featured && (
                    <div className="absolute top-4 right-4 bg-brand-secondary text-white px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest pointer-events-none z-20 shadow-md">
                      مميز
                    </div>
                  )}
                </div>
              )) : (
                <div className="col-span-full text-center py-20 bg-white rounded-[32px] border border-stone-100 shadow-sm">
                  <UtensilsCrossed size={48} className="mx-auto text-stone-300 mb-4" />
                  <h3 className="text-xl font-bold text-brand-secondary mb-2">لا توجد وجبات متاحة حالياً</h3>
                  <p className="text-stone-500">يقوم المطبخ بتجهيز قائمة طعام جديدة، يرجى العودة لاحقاً.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-brand-primary/10 p-4 rounded-2xl text-brand-primary">
                <MessageSquareQuote size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-brand-secondary">آراء العملاء</h2>
                <p className="text-stone-500 font-medium mt-1">تجارب حقيقية من أشخاص جربوا أكل المطبخ</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Info Card for Verified Reviews */}
              <div className="col-span-full mb-4 bg-blue-50 border border-blue-100 p-6 rounded-[24px] flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-blue-900 mb-1">تقييمات موثوقة 100%</h4>
                  <p className="text-blue-800/70 font-medium">في طبلية، لا يمكن إضافة تقييم إلا من العملاء الذين قاموا بطلب وتجربة الأكل بالفعل. لتقييم هذا المطبخ، اذهب إلى صفحة "طلباتي" بعد استلام طلبك.</p>
                </div>
                <Link to="/orders" className="mr-auto whitespace-nowrap bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">
                  طلباتي
                </Link>
              </div>

              {reviews.length > 0 ? reviews.map((review, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={review.id} 
                  className="bg-white p-8 rounded-[24px] shadow-sm border border-stone-100 relative"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-brand-peach flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                      {review.customerPhoto ? (
                        <img src={review.customerPhoto} alt={review.customerName} className="w-full h-full object-cover" />
                      ) : (
                        <Users size={24} className="text-brand-primary opacity-50" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-brand-secondary">{review.customerName}</h4>
                      <div className="flex items-center gap-1 text-yellow-400 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={14} 
                            className={star <= review.rating ? "fill-current" : "text-stone-200"} 
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mr-auto text-xs text-stone-400 font-bold">
                      {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed font-medium italic">
                    "{review.comment}"
                  </p>
                </motion.div>
              )) : (
                <div className="col-span-full text-center py-20 bg-white rounded-[32px] border border-stone-100 shadow-sm">
                  <MessageSquareQuote size={48} className="mx-auto text-stone-300 mb-4" />
                  <h3 className="text-xl font-bold text-brand-secondary mb-2">لا يوجد تقييمات بعد</h3>
                  <p className="text-stone-500">سجل أول تقييم لهذا المطبخ بعد تجربتك للأكل!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Cart Bar */}
      <AnimatePresence>
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 z-50 md:hidden"
        >
          <div className="bg-brand-secondary text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-white/10">
            <div className="flex flex-col">
              <span className="text-sm opacity-90 font-medium">أضف منتجات بقيمة 50.00 ج.م لتبدأ الطلب</span>
            </div>
            <Link to="/cart" className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg">
              عرض السلة
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

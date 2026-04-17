import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Meal, Review } from '../types';
import { CHEF_IMAGE_URL } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Clock, ChefHat, ShoppingCart, ArrowRight, ShieldCheck, Bike, ShoppingBag, MessageSquare, Send, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { FoodPriceDisplay } from '../components/FoodPriceDisplay';

export default function MealDetails() {
  const { id } = useParams();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMeal = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, 'meals', id));
        if (docSnap.exists()) {
          const mealData = { id: docSnap.id, ...docSnap.data() } as Meal;
          setMeal(mealData);
          setActiveImage(mealData.image || (mealData.images && mealData.images[0]) || '');
        }
      } catch (error) {
        console.error("Error fetching meal details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();

    // Listen to reviews
    if (id) {
      const q = query(
        collection(db, 'reviews'),
        where('mealId', '==', id),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const reviewsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Review[];
        setReviews(reviewsData);
      });

      return () => unsubscribe();
    }
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error('يجب تسجيل الدخول لإضافة تقييم');
      return;
    }
    if (!newComment.trim()) {
      toast.error('يرجى كتابة تعليق');
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        mealId: id,
        customerId: auth.currentUser.uid,
        customerName: auth.currentUser.displayName || 'عميل طبلية',
        rating: newRating,
        comment: newComment,
        createdAt: Date.now()
      };

      await addDoc(collection(db, 'reviews'), reviewData);

      // Update meal aggregate rating using a transaction
      if (id) {
        const mealRef = doc(db, 'meals', id);
        await runTransaction(db, async (transaction) => {
          const mealDoc = await transaction.get(mealRef);
          if (!mealDoc.exists()) return;

          const data = mealDoc.data();
          const currentRating = data.rating || 0;
          const currentCount = data.reviewsCount || 0;

          const newCount = currentCount + 1;
          const newAvgRating = ((currentRating * currentCount) + newRating) / newCount;

          transaction.update(mealRef, {
            rating: Number(newAvgRating.toFixed(1)),
            reviewsCount: newCount
          });
        });
      }

      setNewComment('');
      setNewRating(5);
      toast.success('تم إضافة تقييمك بنجاح');
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error('حدث خطأ أثناء إضافة التقييم');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    if (!meal) return;
    addToCart({
      id: meal.id,
      title: meal.title,
      price: meal.price,
      quantity: quantity,
      image: meal.image || (meal.images && meal.images[0]) || '',
      chefId: meal.chefId,
      chefName: meal.chefName
    });

    const serviceFee = meal.price * 0.05;
    const commission = meal.price * 0.15;
    const finalPrice = meal.price - serviceFee;

    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-bold">تمت الإضافة للسلة!</span>
        <span className="text-sm font-bold text-stone-500">{meal.title} • {meal.price} ج.م</span>
        <span className="text-[10px] text-stone-400 font-bold">(ثمن الأكلة: {finalPrice.toFixed(2)} + رسوم: {serviceFee.toFixed(2)} + عمولة: {commission.toFixed(2)})</span>
      </div>,
      {
        duration: 3000,
        position: 'bottom-center'
      }
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div></div>;
  if (!meal) return <div className="min-h-screen flex flex-col items-center justify-center"><h2 className="text-2xl font-bold mb-4">الوجبة غير موجودة</h2><Link to="/meals" className="btn-primary">العودة للأكلات</Link></div>;

  const allImages = meal.images && meal.images.length > 0 ? meal.images : [meal.image];

  return (
    <div className="bg-brand-cream min-h-screen py-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/meals" className="inline-flex items-center gap-2 text-stone-500 hover:text-brand-primary mb-8 transition-colors">
          <ArrowRight size={20} /> العودة للأكلات
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl h-[300px] md:h-[500px]">
              <img src={activeImage} alt={meal.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 pointer-events-none transform scale-90 origin-top-left md:scale-100">
                <FoodPriceDisplay originalPrice={meal.price} />
              </div>
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0 border-4 transition-all ${activeImage === img ? 'border-brand-primary scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`${meal.title} ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-brand-primary/10 text-brand-primary px-4 py-1 rounded-full text-sm font-bold inline-block">
                  {meal.category}
                </span>
                {meal.orderType && (
                  <span className={`px-4 py-1 rounded-full text-sm font-bold inline-block ${meal.orderType === 'instant' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {meal.orderType === 'instant' ? 'فوري' : 'طلب يوم بيومه'}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-[56px] font-bold text-brand-accent mb-4 leading-tight">{meal.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-stone-500">
                <div className="flex items-center gap-1 text-brand-accent">
                  <Star size={20} className="fill-brand-accent" />
                  <span className="text-lg font-bold">{meal.rating}</span>
                  <span className="text-stone-400 font-normal text-sm">({meal.reviewsCount} تقييم)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span>45-60 دقيقة</span>
                </div>
              </div>
            </div>

            <div className="food-card p-[20px] mb-8">
              <h3 className="font-bold text-brand-accent mb-4">وصف الوجبة</h3>
              <p className="text-stone-600 leading-relaxed">
                {meal.description || "هذه الوجبة محضرة من أجود المكونات الطازجة على الطريقة المنزلية التقليدية. وجبة متكاملة تشبع حواسك وتذكرك بطعم أكل البيت الأصيل."}
              </p>
            </div>

            <div className="flex items-center gap-4 mb-10">
              <Link to={`/chef/${meal.chefId}`} className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-full bg-brand-secondary flex items-center justify-center border-2 border-white shadow-sm group-hover:border-brand-primary transition-all overflow-hidden">
                  <img 
                    src={CHEF_IMAGE_URL} 
                    alt={meal.chefName} 
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <p className="text-xs text-stone-400">بواسطة الشيف</p>
                  <p className="font-bold text-stone-900 group-hover:text-brand-primary transition-colors">{meal.chefName}</p>
                </div>
              </Link>
            </div>

            <div className="mt-auto space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="flex items-center bg-white rounded-full border border-stone-200 p-1 shadow-sm w-full sm:w-auto justify-between sm:justify-start">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-brand-cream text-stone-600 text-2xl"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-brand-cream text-stone-600 text-2xl"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex gap-4 w-full sm:flex-grow">
                    <button 
                      onClick={handleAddToCart}
                      className="bg-brand-secondary text-white w-full py-4 flex items-center justify-center gap-3 text-lg rounded-full font-bold hover:bg-brand-accent transition-colors shadow-lg"
                    >
                      <ShoppingBag size={24} /> أضف للسلة
                    </button>
                    <Link 
                      to="/checkout" 
                      onClick={handleAddToCart}
                      className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg"
                    >
                      <ShoppingCart size={24} /> اشتري الآن
                    </Link>
                  </div>
                </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-stone-500 bg-stone-100/50 p-4 rounded-2xl">
                  <ShieldCheck className="text-green-600" />
                  <span>معايير نظافة عالية</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-500 bg-stone-100/50 p-4 rounded-2xl">
                  <Bike className="text-brand-secondary" />
                  <span>توصيل سريع ومضمون</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-brand-accent">آراء العملاء ({reviews.length})</h2>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-stone-100">
                <Star className="fill-brand-primary text-brand-primary" size={20} />
                <span className="font-bold text-xl">{meal.rating || 0}</span>
              </div>
            </div>

            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={review.id} 
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-stone-100"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-brand-cream flex items-center justify-center text-brand-primary">
                          <User size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-brand-accent">{review.customerName}</p>
                          <p className="text-xs text-stone-400">
                            {new Date(review.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-brand-cream px-3 py-1 rounded-full text-brand-primary font-bold text-sm">
                        <span>{review.rating}</span>
                        <Star size={14} className="fill-brand-primary" />
                      </div>
                    </div>
                    <p className="text-stone-600 leading-relaxed italic">"{review.comment}"</p>
                  </motion.div>
                ))
              ) : (
                <div className="bg-white p-12 rounded-[2rem] text-center border-2 border-dashed border-stone-200">
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                    <MessageSquare size={32} />
                  </div>
                  <p className="text-stone-500 font-bold">لا توجد تقييمات بعد. كن أول من يقيم هذه الوجبة!</p>
                </div>
              )}
            </div>
          </div>

          {/* Add Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100 sticky top-[120px]">
              <h3 className="text-2xl font-black text-brand-accent mb-6">أضف تقييمك</h3>
              
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-stone-500 mb-3">تقييمك للوجبة</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="transition-transform active:scale-90"
                      >
                        <Star 
                          size={32} 
                          className={`${star <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-stone-200'} transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-bold text-stone-500 mb-3">رأيك بالتفصيل</label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="اكتب تجربتك مع هذه الوجبة..."
                    className="w-full bg-brand-cream border-transparent focus:border-brand-primary focus:ring-0 rounded-2xl p-4 text-stone-900 resize-none transition-all"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-primary text-white py-4 rounded-full font-black text-lg shadow-lg hover:bg-brand-accent transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send size={20} />
                      إرسال التقييم
                    </>
                  )}
                </button>
              </form>

              {!auth.currentUser && (
                <div className="mt-6 p-4 bg-brand-cream rounded-2xl text-center">
                  <p className="text-sm text-stone-600 font-bold mb-2">سجل دخولك لتتمكن من إضافة تقييم</p>
                  <Link to="/login" className="text-brand-primary font-black hover:underline">تسجيل الدخول</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

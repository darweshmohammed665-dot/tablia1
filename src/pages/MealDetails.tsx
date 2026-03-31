import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Meal } from '../types';
import { motion } from 'framer-motion';
import { Star, Clock, ChefHat, ShoppingCart, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export default function MealDetails() {
  const { id } = useParams();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchMeal = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, 'meals', id));
        if (docSnap.exists()) {
          setMeal({ id: docSnap.id, ...docSnap.data() } as Meal);
        }
      } catch (error) {
        console.error("Error fetching meal details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div></div>;
  if (!meal) return <div className="min-h-screen flex flex-col items-center justify-center"><h2 className="text-2xl font-bold mb-4">الوجبة غير موجودة</h2><Link to="/meals" className="btn-primary">العودة للأكلات</Link></div>;

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <Link to="/meals" className="inline-flex items-center gap-2 text-stone-500 hover:text-brand-primary mb-8 transition-colors">
          <ArrowRight size={20} /> العودة للأكلات
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative rounded-[3rem] overflow-hidden shadow-2xl h-[500px]"
          >
            <img src={meal.image} alt={meal.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full text-xl font-bold text-brand-primary shadow-lg">
              {meal.price} ج.م
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <span className="bg-brand-primary/10 text-brand-primary px-4 py-1 rounded-full text-sm font-bold mb-4 inline-block">
                {meal.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">{meal.title}</h1>
              
              <div className="flex items-center gap-6 text-stone-500">
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

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 mb-8">
              <h3 className="font-bold text-stone-900 mb-4">وصف الوجبة</h3>
              <p className="text-stone-600 leading-relaxed">
                {meal.description || "هذه الوجبة محضرة من أجود المكونات الطازجة على الطريقة المنزلية التقليدية. وجبة متكاملة تشبع حواسك وتذكرك بطعم أكل البيت الأصيل."}
              </p>
            </div>

            <div className="flex items-center gap-4 mb-10">
              <Link to={`/chef/${meal.chefId}`} className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-full bg-stone-200 overflow-hidden border-2 border-white shadow-sm group-hover:border-brand-primary transition-all">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(meal.chefName)}&background=c65d3a&color=fff`} alt={meal.chefName} />
                </div>
                <div>
                  <p className="text-xs text-stone-400">بواسطة الشيف</p>
                  <p className="font-bold text-stone-900 group-hover:text-brand-primary transition-colors">{meal.chefName}</p>
                </div>
              </Link>
            </div>

            <div className="mt-auto space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-white rounded-full border border-stone-200 p-1 shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-stone-50 text-stone-600"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-stone-50 text-stone-600"
                  >
                    +
                  </button>
                </div>
                <Link to="/checkout" className="btn-primary flex-grow py-4 flex items-center justify-center gap-3 text-lg">
                  <ShoppingCart size={24} /> اشتري الآن - {(meal.price * quantity).toFixed(0)} ج.م
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-stone-500 bg-stone-100/50 p-4 rounded-2xl">
                  <ShieldCheck className="text-green-600" />
                  <span>معايير نظافة عالية</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-500 bg-stone-100/50 p-4 rounded-2xl">
                  <Truck className="text-brand-secondary" />
                  <span>توصيل سريع في طنطا</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

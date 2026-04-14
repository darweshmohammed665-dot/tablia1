import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Meal } from '../types';
import { CHEF_IMAGE_URL } from '../constants';
import { motion } from 'motion/react';
import { Star, Clock, ChefHat, ShoppingCart, ArrowRight, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export default function MealDetails() {
  const { id } = useParams();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!meal) return;
    addToCart({
      id: meal.id,
      title: meal.title,
      price: meal.price,
      quantity: quantity,
      image: meal.image,
      chefId: meal.chefId,
      chefName: meal.chefName
    });
    toast.success(`تم إضافة ${quantity} ${meal.title} إلى السلة`);
  };

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
            className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl h-[300px] md:h-[500px]"
          >
            <img src={meal.image} alt={meal.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/90 backdrop-blur-md px-4 md:px-6 py-1 md:py-2 rounded-full text-lg md:text-xl font-bold text-brand-primary shadow-lg">
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

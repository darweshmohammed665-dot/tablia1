import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Trash2, ArrowRight, ShoppingBag, ChevronLeft, Plus, Minus, Info, Sparkles, Clock, Calendar } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { Meal } from '../types';
import { formatTime12h } from '../lib/date-utils';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, addToCart } = useCart();
  const [recommendations, setRecommendations] = useState<Meal[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (cartItems.length > 0 && db) {
        // Get unique chefIds from cart
        const chefIds = [...new Set(cartItems.map(item => item.chefId))];
        const currentMealIds = cartItems.map(item => item.id);

        try {
          const q = query(
            collection(db, 'meals'),
            where('chefId', 'in', chefIds.slice(0, 10)), // Firestore limits 'in' to 10
            limit(10)
          );
          
          const querySnapshot = await getDocs(q);
          const suggestedMeals = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Meal))
            .filter(meal => !currentMealIds.includes(meal.id))
            .slice(0, 6);
            
          setRecommendations(suggestedMeals);
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        }
      }
    };

    fetchRecommendations();
  }, [cartItems]);

  const totalFoodValue = cartTotal;
  const serviceFeeRate = 0.05;
  const serviceFee = totalFoodValue * serviceFeeRate;
  const deliveryFee = 18.99;
  const isFirstOrder = true; // Mock for demo
  const total = totalFoodValue + serviceFee + (isFirstOrder ? 0 : deliveryFee);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 bg-orange-100 rounded-[32px] flex items-center justify-center text-orange-500 rotate-12">
            <ShoppingBag size={64} />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg border-4 border-white">!</div>
        </motion.div>
        <h2 className="text-3xl font-black text-brand-accent mb-4">لا توجد طلبات</h2>
        <p className="text-stone-500 mb-12 max-w-xs leading-relaxed text-lg">عندما تقوم بالطلب، سيظهر طلبك هنا. ابدأ باكتشاف أشهى الوجبات المنزلية!</p>
        <Link to="/meals" className="btn-primary px-12 py-5 text-xl shadow-2xl shadow-brand-primary/20">تصفح الوجبات</Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen py-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-[56px] font-bold text-brand-accent mb-12 flex items-center gap-4">
          <ShoppingCart size={36} className="text-brand-primary" /> سلة التسوق
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="food-card p-[20px] flex flex-col sm:flex-row items-center gap-6"
              >
                <img src={item.image} alt={item.title} className="w-32 h-32 rounded-[18px] object-cover shadow-sm" />
                <div className="flex-grow text-center sm:text-right">
                  <h3 className="text-xl font-bold text-brand-accent mb-1">{item.title}</h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                    <span className="text-brand-primary font-bold">{item.price} ج.م</span>
                    {item.scheduledTime && (
                      <span className="bg-brand-peach/30 text-brand-secondary px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1">
                        <Calendar size={10} /> {item.scheduledDate} 
                        <Clock size={10} className="mr-1" /> {formatTime12h(item.scheduledTime)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center bg-brand-cream rounded-full border border-stone-200 p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-stone-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-stone-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="text-xl font-bold text-brand-accent sm:mr-auto">
                  {(item.price * item.quantity).toFixed(0)} ج.م
                </div>
              </motion.div>
            ))}

            <Link to="/meals" className="inline-flex items-center gap-2 text-brand-secondary font-bold hover:underline mt-4">
              <ArrowRight size={20} /> إضافة المزيد من الوجبات
            </Link>

            {/* Recommendation from the kitchen */}
            {recommendations.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-brand-accent">إقتراح من المطبخ...</h3>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                  {recommendations.map((meal) => (
                    <div key={meal.id} className="min-w-[180px] bg-white rounded-[2rem] p-4 border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                      <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative">
                        <img src={meal.image} alt={meal.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        {meal.orderType === 'instant' && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">فوري ⚡</div>
                        )}
                      </div>
                      <h4 className="font-bold text-brand-accent text-sm mb-1 truncate">{meal.title}</h4>
                      <p className="text-[10px] text-stone-400 mb-3 truncate">{meal.chefName}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-brand-primary font-black text-sm">{meal.price} ج.م</span>
                        <button 
                          onClick={() => addToCart({
                            id: meal.id,
                            title: meal.title,
                            price: meal.price,
                            quantity: 1,
                            image: meal.image,
                            chefId: meal.chefId,
                            chefName: meal.chefName,
                            orderType: meal.orderType || 'instant'
                          })}
                          className="w-10 h-10 bg-brand-cream rounded-full flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="food-card p-[20px] sticky top-24 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-brand-accent mb-6">ملخص الدفع</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-stone-600">
                    <span className="font-bold">ثمن الوجبات</span>
                    <span className="font-bold">{totalFoodValue.toFixed(2)} ج.م</span>
                  </div>

                  <div className="flex justify-between text-stone-600 items-center">
                    <div className="flex items-center gap-1">
                      <span>رسوم خدمة (5%)</span>
                      <Info size={14} className="text-stone-300" />
                    </div>
                    <span>{serviceFee.toFixed(2)} ج.م</span>
                  </div>

                  <div className="flex justify-between text-stone-600 items-center">
                    <div className="flex items-center gap-1">
                      <span className={isFirstOrder ? "bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider" : ""}>
                        توصيل مجاني أول طلب
                      </span>
                      <Info size={14} className="text-stone-300" />
                    </div>
                    <span className={isFirstOrder ? "font-bold text-brand-primary" : ""}>
                      {isFirstOrder ? "00.00" : deliveryFee.toFixed(2)} ج.م
                    </span>
                  </div>

                  <div className="pt-6 border-t border-dashed border-stone-200 flex justify-between items-baseline">
                    <span className="text-xl font-black text-brand-secondary">المبلغ الإجمالي</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-brand-primary tracking-tighter">
                        {total.toFixed(2)}
                      </span>
                      <span className="text-sm font-black text-brand-primary">ج.م</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link to="/checkout" className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
                  تابع للدفع <ChevronLeft size={20} />
                </Link>
                <Link to="/meals" className="bg-white border border-brand-primary text-brand-primary w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-brand-cream transition-colors">
                  أضف المزيد
                </Link>
              </div>

              <div className="mt-4 p-4 bg-brand-secondary/5 rounded-2xl border border-brand-secondary/10 flex items-center gap-3 text-sm text-brand-secondary">
                <div className="w-2 h-2 bg-brand-secondary rounded-full animate-pulse"></div>
                <span>توصيل سريع خلال 60 دقيقة في طنطا</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

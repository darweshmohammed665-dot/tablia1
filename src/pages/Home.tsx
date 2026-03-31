import { motion, useScroll, useTransform } from 'motion/react';
import { Search, MapPin, Star, Clock, ChevronLeft, ArrowRight, Utensils, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChefMap from '../components/ChefMap';
import { useRef } from 'react';

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityBackground = useTransform(scrollYProgress, [0, 1], [0.6, 0]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacityText = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="relative bg-brand-cream">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: yBackground, opacity: opacityBackground }}
        >
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2000" 
            alt="Food Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.25))' }}></div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            className="flex flex-col items-start text-right"
            style={{ y: yText, opacity: opacityText }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-[72px] md:text-[96px] font-black leading-[0.9] text-white mb-8"
            >
              أحلى أكل بيتي في طنطا
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-stone-200 max-w-2xl font-medium leading-relaxed mb-10"
            >
              أشهى الأكلات الفلاحي والبيتي من إيد أمهر الشيفات في طنطا. طعم يرجعك لأيام زمان.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full max-w-2xl bg-white p-2 rounded-[16px] shadow-2xl flex items-center mt-4"
            >
              <div className="flex-grow flex items-center px-4">
                <Search className="text-stone-400 ml-3" size={24} />
                <input 
                  type="text" 
                  placeholder="نفسك تاكل إيه النهاردة؟" 
                  className="w-full bg-transparent border-none focus:ring-0 text-lg text-stone-700 placeholder-stone-400 h-12 outline-none" 
                />
              </div>
              <Link to="/meals" className="bg-brand-accent text-white px-10 py-4 rounded-[16px] font-black text-lg hover:scale-105 transition-transform whitespace-nowrap">
                اطلب الآن
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trending Marquee - Global Style */}
      <div className="bg-stone-950 py-6 md:py-10 overflow-hidden border-y border-white/10 z-30 relative">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 md:gap-20 mx-5 md:mx-10">
              <span className="text-3xl md:text-6xl font-black text-white/10 uppercase tracking-tighter">TABLIYA TANTA</span>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-brand-primary rounded-full"></div>
              <span className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter">AUTHENTIC EGYPTIAN</span>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-brand-accent rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="food-card p-[20px] flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-beige rounded-2xl flex items-center justify-center text-brand-primary mb-6">
                <Utensils size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-brand-accent">طهاة محترفون</h3>
              <p className="text-stone-500">أكثر من 50 شيف من أمهر ستات البيوت في طنطا.</p>
            </div>
            <div className="food-card p-[20px] flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-beige rounded-2xl flex items-center justify-center text-brand-secondary mb-6">
                <Clock size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-brand-accent">توصيل سريع</h3>
              <p className="text-stone-500">نصل إليك في أسرع وقت ممكن لضمان جودة الأكل.</p>
            </div>
            <div className="food-card p-[20px] flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-beige rounded-2xl flex items-center justify-center text-brand-accent mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-brand-accent">جودة مضمونة</h3>
              <p className="text-stone-500">رقابة صارمة على معايير النظافة والجودة في كل مطبخ.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-[100px] bg-brand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-[72px] font-black mb-6 text-brand-primary leading-[0.9]">نفسك في إيه؟</h2>
            <p className="text-stone-600 text-2xl font-medium">من المحشي للفطير.. كل اللي قلبك يحبه موجود هنا.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[800px]">
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 md:row-span-2 relative rounded-[2rem] md:rounded-[3rem] overflow-hidden group cursor-pointer aspect-[4/5] md:aspect-auto"
            >
              <img src="https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Mahshi" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10">
                <h3 className="text-2xl md:text-4xl font-black mb-2">المحاشي الفلاحي</h3>
                <p className="text-brand-accent font-bold text-sm md:text-base">من قلب الغيط لسفرتك</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 relative rounded-[2rem] md:rounded-[3rem] overflow-hidden group cursor-pointer aspect-video md:aspect-auto"
            >
              <img src="https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Feteer" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 text-right">
                <h3 className="text-2xl md:text-3xl font-black mb-1">فطير مشلتت</h3>
                <p className="text-brand-accent font-bold text-sm md:text-base">بالسمنة البلدي والعسل</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden group cursor-pointer aspect-square md:aspect-auto"
            >
              <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Desserts" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 right-6">
                <h3 className="text-xl md:text-2xl font-black">حلويات</h3>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden group cursor-pointer bg-brand-primary flex flex-col items-center justify-center text-center p-6 md:p-8 aspect-square md:aspect-auto"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <ArrowRight size={24} className="rotate-180 md:w-8 md:h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-black">كل الأقسام</h3>
              <p className="text-white/70 text-xs md:text-sm mt-2">اكتشف أكتر من 20 قسم مختلف</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Meals */}
      <section className="py-[100px] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-6">
            <div className="text-right">
              <h2 className="text-[72px] font-black text-brand-primary mb-6 leading-[0.9]">الأكثر طلباً</h2>
              <p className="text-stone-600 text-2xl font-medium">الأكلات اللي عاملة قلبان في طنطا اليومين دول</p>
            </div>
            <Link to="/meals" className="btn-secondary py-3 px-8 flex items-center gap-2">
              تصفح المنيو كامل <ChevronLeft size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'محشي ورق عنب بالريش', chef: 'أم أحمد', price: 250, rating: 4.9, img: 'https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?auto=format&fit=crop&q=80&w=800', tag: 'الأكثر طلباً' },
              { title: 'مكرونة بشاميل ملكي', chef: 'مطبخ هنا', price: 120, rating: 4.8, img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=800', tag: 'جديد' },
              { title: 'كفتة مشوية على الفحم', chef: 'الشيف محمد', price: 180, rating: 4.7, img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=800', tag: 'عرض خاص' },
            ].map((meal, i) => (
              <div key={i} className="food-card overflow-hidden flex flex-col">
                <div className="relative h-64">
                  <img src={meal.img} alt={meal.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 bg-brand-cream/90 backdrop-blur-sm text-brand-accent px-3 py-1 rounded-full text-xs font-bold">
                    {meal.tag}
                  </div>
                </div>
                <div className="p-[20px] flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-brand-primary">{meal.title}</h3>
                    <div className="flex items-center gap-1 text-brand-accent">
                      <Star size={16} className="fill-brand-accent" />
                      <span className="font-bold text-sm">{meal.rating}</span>
                    </div>
                  </div>
                  <p className="text-stone-500 text-sm mb-4">بواسطة <span className="font-bold">{meal.chef}</span></p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-100">
                    <span className="text-2xl font-bold text-brand-primary">{meal.price} ج.م</span>
                    <Link to="/checkout" className="bg-brand-accent text-white py-2 px-6 text-sm rounded-[10px] font-semibold hover:scale-105 transition-transform">
                      أضف للسلة
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ChefMap />

      {/* CTA Section */}
      <section className="py-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[20px] overflow-hidden min-h-[400px] flex items-center shadow-[0_15px_35px_rgba(0,0,0,0.08)]">
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=2000" 
              alt="Chef cooking"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))' }}></div>
            
            <div className="relative z-10 p-8 md:p-16 text-right text-white max-w-2xl ml-auto">
              <h2 className="text-[56px] font-bold mb-6 leading-tight">
                عندك نفس حريف؟
              </h2>
              <p className="text-xl text-stone-200 mb-8 leading-relaxed">
                انضمي لأكبر مجتمع حريفة في طنطا. وصلي طعمك لكل بيت وانتي في مكانك.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Link to="/register?role=chef" className="btn-primary px-10">
                  ابدأ بيع الآن
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-12 border-t border-stone-200 text-center">
        <p className="text-stone-400 font-medium">
          صنع بكل <Heart className="inline text-brand-primary fill-brand-primary mx-1" size={16} /> في طنطا - مصر
        </p>
      </footer>
    </div>
  );
}

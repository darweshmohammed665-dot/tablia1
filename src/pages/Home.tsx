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
              التميز في الأكل البيتي يبدأ من طبلية
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
              <Link to="/meals" className="bg-brand-primary text-white px-10 py-4 rounded-[16px] font-black text-lg hover:scale-105 transition-transform whitespace-nowrap">
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

      {/* Bento Grid Categories */}
      <section className="py-[100px] bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[56px] font-black text-brand-primary mb-12 text-right">أقسامنا المميزة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            <div className="md:col-span-2 rounded-[2rem] overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Mahshi" />
              <div className="absolute inset-0 bg-black/40 p-8 flex flex-col justify-end text-white">
                <h3 className="text-3xl font-black">المحاشي الفلاحي</h3>
                <p className="text-white font-bold">من قلب الغيط لسفرتك</p>
              </div>
            </div>
            <div className="rounded-[2rem] overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Feteer" />
              <div className="absolute inset-0 bg-black/40 p-8 flex flex-col justify-end text-white">
                <h3 className="text-3xl font-black">فطير مشلتت</h3>
              </div>
            </div>
            <div className="rounded-[2rem] overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Desserts" />
              <div className="absolute inset-0 bg-black/40 p-8 flex flex-col justify-end text-white">
                <h3 className="text-3xl font-black">حلويات</h3>
              </div>
            </div>
            <div className="md:col-span-2 rounded-[2rem] bg-brand-primary p-8 flex flex-col justify-center text-white">
              <h3 className="text-4xl font-black mb-4">اكتشف المزيد</h3>
              <p className="text-lg opacity-80">أكثر من 20 قسم متنوع بانتظارك!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Meals */}
      <section className="py-[100px] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[56px] font-black text-brand-primary mb-12 text-right">تريند النهاردة 🔥</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="food-card p-4 hover:shadow-2xl transition-shadow">
                <img src={`https://picsum.photos/seed/${i}/400/300`} className="w-full h-48 object-cover rounded-2xl mb-4" alt="Meal" />
                <h3 className="text-xl font-bold text-brand-primary mb-2">أكلة تريند {i}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-brand-primary font-black text-xl">150 ج.م</span>
                  <button className="bg-brand-primary text-white px-4 py-2 rounded-xl font-bold">اطلب</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-[100px] bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[56px] font-black text-brand-primary mb-12 text-right">أقرب الطهاة إليك</h2>
          <div className="rounded-[2rem] overflow-hidden shadow-2xl h-[500px]">
            <ChefMap />
          </div>
        </div>
      </section>
    </div>
  );
}

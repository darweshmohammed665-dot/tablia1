import { motion, useScroll, useTransform } from 'motion/react';
import { ShoppingBag, Clock, ArrowRight, MessageCircle, Utensils, Heart, Star, ShieldCheck, ChevronLeft, MapPin, Flame, Award, Sparkles, Dices } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ChefMap from '../components/ChefMap';
import { MealCard } from '../components/MealCard';
import { useRef, useEffect, useState } from 'react';
import { CHEF_IMAGE_URL } from '../constants';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export default function Home() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const handleSurpriseMe = () => {
    toast.success('جاري اختيار أكلة عشوائية لك...', { icon: '🎲' });
    setTimeout(() => {
      navigate('/meals');
    }, 1500);
  };

  return (
    <div ref={containerRef} className="relative bg-brand-cream overflow-hidden selection:bg-brand-primary selection:text-white">
      {/* Background Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.03] bg-grain"></div>

      {/* Hero Section - Shef Style */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear" 
          }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Egyptian Home Cooking Table"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/50 to-brand-cream"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 1 }}
            className="inline-block mb-8"
          >
            <span className="bg-brand-primary/20 border border-brand-primary/50 text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase backdrop-blur-md shadow-[0_0_30px_rgba(220,38,38,0.3)]">
              ✨ تجربة طعام لا تُنسى في مدينتك
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-[80px] font-serif font-black text-white mb-8 leading-tight md:leading-[1.2] drop-shadow-2xl px-2"
          >
            تعبت من أكل الشارع؟ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-orange-400 py-2 inline-block">طبلية بيوصلك أكل بيت حقيقي</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-3xl text-white/90 mb-12 font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-lg"
          >
            من مطبخ ست شاطرة، بأحسن جودة وأقل سعر ولحد باب بيتك.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto mb-12"
          >
            <Link to="/meals" className="w-full sm:w-auto bg-brand-primary text-white px-10 py-5 rounded-full font-black text-xl hover:bg-brand-primary/90 hover:scale-105 transition-all shadow-[0_10px_40px_rgba(220,38,38,0.4)] flex items-center justify-center gap-3">
              <Utensils size={24} />
              اكتشف الأكل
            </Link>
            <button 
              onClick={handleSurpriseMe}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-5 rounded-full font-black text-xl hover:bg-white/20 hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              <Dices size={24} className="text-brand-primary" />
              محتار تاكل إيه؟
            </button>
          </motion.div>
        </div>
      </section>

      {/* Trending Luxury Ticker - Local Hero Design */}
      <div className="relative z-30 w-full bg-brand-secondary border-y border-white/10 shadow-xl py-3 md:py-4 overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(241,29,88,0.03)_0%,_transparent_70%)] pointer-events-none" />
        
        <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-default">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 md:gap-14 mx-5 md:mx-8">
              <div className="flex items-center gap-3">
                <div className="bg-brand-primary text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">NO. 1</div>
                <span className="text-white text-sm md:text-xl font-black tracking-tight select-none">طبلية رقم 1 في طنطا 🏆</span>
              </div>
              
              <span className="text-white/20 select-none">•</span>
              
              <div className="flex items-center gap-3">
                <Heart className="text-brand-primary" size={18} />
                <span className="text-white text-sm md:text-lg font-medium italic font-serif select-none">الأكل البيتي على أصوله</span>
              </div>
              
              <span className="text-white/20 select-none">•</span>
              
              <div className="flex items-center gap-3">
                <MapPin className="text-brand-primary" size={18} />
                <span className="text-white text-sm md:text-lg font-black tracking-tight select-none">من مطبخنا لبيتك في طنطا 🚀</span>
              </div>
              
              <span className="text-white/20 select-none">•</span>
              
              <div className="flex items-center gap-3 px-4 py-1 rounded-full bg-white/5 border border-white/10">
                <Award className="text-yellow-500" size={16} />
                <span className="text-white text-[10px] md:text-xs font-bold tracking-widest uppercase select-none">أفضل جودة في التوصيل</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Decorative Gloss Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
      </div>

      {/* Professional Bento Grid Categories Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-brand-accent/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="text-right">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex items-center justify-end gap-3 mb-4"
              >
                <div className="h-px w-12 bg-brand-primary" />
                <span className="text-brand-primary font-black tracking-[0.2em] uppercase text-xs">قائمة طبلية</span>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-serif font-bold text-brand-secondary leading-[1.1]"
              >
                خريطة المذاق <br /> <span className="text-brand-primary">المصري</span>
              </motion.h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[260px]">
            {/* Box 1: Egyptian Home Cooking (Large - span 8) */}
            <motion.div 
              whileHover={{ y: -8, shadow: "0 25px 50px -12px rgba(220, 38, 38, 0.25)" }}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-8 md:row-span-2 rounded-[48px] overflow-hidden group relative shadow-2xl border-4 border-white"
            >
              <Link to="/meals?category=أكل بيتي مصري" className="block w-full h-full relative">
                <img 
                  src="https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=1400" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s] ease-out" 
                  alt="Egyptian Home Cooking" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/95 via-brand-secondary/40 to-transparent p-12 flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-brand-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                       <Sparkles size={12} /> أصل الطعم واللمة
                    </span>
                  </div>
                  <h3 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-lg">أكل بيتي مصري</h3>
                  <div className="flex flex-wrap gap-3">
                    {["محشي", "ملوخية", "طبيخ"].map(tag => (
                      <span key={tag} className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white font-bold text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Box 2: Grills (span 4) */}
            <motion.div 
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-4 md:row-span-1 rounded-[40px] overflow-hidden group relative shadow-xl border border-stone-100"
            >
              <Link to="/meals?category=مشويات" className="block w-full h-full relative">
                <img 
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                  alt="Grills" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 via-orange-900/40 to-transparent p-8 flex flex-col justify-end">
                  <h3 className="text-3xl font-black text-white mb-3">مشويات</h3>
                  <p className="text-white/70 text-sm font-bold flex flex-wrap gap-2">
                    <span>كباب</span> • <span>كفتة</span> • <span>فراخ</span>
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Box 3: Rural Food (span 4) */}
            <motion.div 
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-4 md:row-span-1 rounded-[40px] overflow-hidden group relative shadow-xl border border-stone-100"
            >
              <Link to="/meals?category=أكل فلاحي / ريفي" className="block w-full h-full relative">
                <img 
                  src="https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=1000" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                  alt="Rural Food" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/40 to-transparent p-8 flex flex-col justify-end">
                  <h3 className="text-3xl font-black text-white mb-3">أكل فلاحي</h3>
                  <p className="text-white/70 text-sm font-bold">بط • فطير • عيش بلدي</p>
                </div>
              </Link>
            </motion.div>

            {/* Box 4: Fast Food (span 4) */}
            <motion.div 
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-4 md:row-span-2 rounded-[48px] overflow-hidden group relative shadow-xl border border-stone-100 bg-brand-accent/5"
            >
              <Link to="/meals?category=أكلات سريعة ومطلوبة" className="block w-full h-full relative">
                <img 
                  src="https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=1000" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                  alt="Fast Food" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-accent/95 via-brand-accent/50 to-transparent p-10 flex flex-col justify-end">
                  <h3 className="text-4xl font-black text-white mb-6">أكلات سريعة</h3>
                  <div className="space-y-3">
                    {[
                      { l: "ساندوتشات", s: "شاورما، برجر" },
                      { l: "فرايد تشيكن", s: "كرسبي وسخن" },
                      { l: "سوري", s: "زنجر وبطاطس" }
                    ].map((item, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                        <p className="text-white font-black text-sm mb-0.5">{item.l}</p>
                        <p className="text-white/60 text-[10px] font-bold">{item.s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Box 5: Popular/Street Food (span 4) */}
            <motion.div 
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="md:col-span-4 md:row-span-1 rounded-[40px] bg-stone-50 p-10 border border-stone-100 relative overflow-hidden group shadow-lg"
            >
              <Link to="/meals?category=أكلات شعبية" className="block w-full h-full flex flex-col justify-center text-right">
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-6xl mb-6 relative z-10"
                >
                  🥙
                </motion.div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-black text-brand-secondary mb-3">أكلات شعبية</h3>
                  <p className="text-stone-500 font-bold text-lg">كشري • فول • طعمية</p>
                </div>
                {/* Large Background Arabic Text for "Professional" look */}
                <div className="absolute bottom-0 left-0 text-stone-200/50 font-black text-[140px] leading-none select-none pointer-events-none transition-transform group-hover:scale-110">
                  شعبية
                </div>
              </Link>
            </motion.div>

            {/* Box 6: International (span 4) */}
            <motion.div 
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="md:col-span-4 md:row-span-2 rounded-[48px] overflow-hidden group relative shadow-2xl border-4 border-white"
            >
              <Link to="/meals?category=أكلات عالمية منتشرة في مصر" className="block w-full h-full relative">
                <img 
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]" 
                  alt="International Food" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/95 via-stone-900/40 to-transparent p-12 flex flex-col justify-end">
                  <div className="mb-6">
                    <span className="text-stone-400 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">World Cuisine</span>
                    <h3 className="text-4xl font-black text-white">أكلات عالمية</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { n: "إيطالي", d: "باستا - بيتزا", i: "🇮🇹" },
                      { n: "آسيوي / صيني", d: "نودلز - رايس", i: "🎋" },
                      { n: "كوري", d: "رامن - توكبوكي", i: "🥢" },
                      { n: "سوشي ياباني", d: "أصناف السلمون", i: "🍣" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl group/item hover:bg-white/10 transition-colors">
                        <div>
                          <p className="text-white font-black text-sm">{item.n}</p>
                          <p className="text-white/40 text-[10px] font-bold">{item.d}</p>
                        </div>
                        <span className="text-xl">{item.i}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Box 7: Diet/Healthy (span 4) */}
            <motion.div 
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="md:col-span-4 md:row-span-1 rounded-[40px] bg-emerald-500 p-10 relative overflow-hidden group shadow-2xl"
            >
              <Link to="/meals?category=وجبات دايت / صحي" className="block w-full h-full relative z-10 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-md border border-white/20">🥗</div>
                  <span className="text-[10px] font-black text-emerald-100 uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full">Healthy Choice</span>
                </div>
                <h3 className="text-3xl font-black text-white mb-2">دايت وصحي</h3>
                <p className="text-emerald-100/70 font-bold">كل اللي بتحبه بس خفيف</p>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none" />
              </Link>
            </motion.div>

            {/* Box 8: Desserts (span 8) */}
            <motion.div 
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="md:col-span-8 md:row-span-1 rounded-[40px] overflow-hidden group relative shadow-2xl border-4 border-white"
            >
              <Link to="/meals?category=الحلويات" className="block w-full h-full relative">
                <img 
                  src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=1500" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]" 
                  alt="Desserts" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-rose-950/90 via-rose-950/40 to-transparent p-12 flex flex-col justify-center text-right">
                   <div className="flex flex-col items-end gap-2 mb-6">
                    <span className="text-rose-300 text-6xl group-hover:scale-110 transition-transform">🍰</span>
                    <h3 className="text-5xl md:text-6xl font-black text-white">الحلويات</h3>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-end max-w-2xl">
                    {[
                      { t: "حلويات شرقي", s: "بسبوسة، كنافة، قطايف" },
                      { t: "حلويات غربي", s: "كيك، تشيز كيك، براونيز" },
                      { t: "مخبوزات", s: "كرواسون، دونات، سينابون" }
                    ].map((item, i) => (
                      <div key={i} className="text-right p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 min-w-[200px]">
                        <p className="text-white font-black text-lg mb-1">{item.t}</p>
                        <p className="text-white/60 text-xs font-bold leading-relaxed">{item.s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-20 flex flex-col items-center gap-6"
          >
            <Link to="/meals" className="group flex items-center gap-4 text-stone-400 font-bold hover:text-brand-primary transition-all">
              <span className="text-lg">تصفح القائمة الكاملة للأصناف</span>
              <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:text-white transition-all">
                <ArrowRight size={20} />
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-brand-secondary mb-8">قصة طبلية</h2>
              <div className="space-y-6 text-stone-600 text-xl leading-relaxed font-medium">
                <p>
                  كل شارع فيه بيت ريحة أكله بتجوع الجيران، وفي كل بيت ست شاطرة نفسها أكلها وحلاوة نفسها يوصلوا للناس.
                </p>
                <p>
                  وفي نفس الشارع.. موظف راجع مهدود، أو أم وراها ألف حاجة، ونفسهم في لقمة بيتي ترم العضم من غير فرهدة المطبخ أو أسعار الدليفري اللي بتخلص المرتب.
                </p>
                <p>
                  من هنا بدأت طبلية.. قررنا نكون حلقة الوصل اللي بتريح الطرفين. قفلنا دايرة التعب، وفتحنا مطابخ أشطر ستات في بلدنا عشان تجبلك أكل بيتي بجودة عالية ونضافة وسعر على قد الإيد، وعلشان تساعد كل ست بيت نفسها تفتح مشروعها الخاص من مطبخها.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[40px] overflow-hidden shadow-2xl aspect-square bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center p-12"
            >
              <div className="text-white text-center">
                <Utensils size={120} className="mx-auto mb-6 opacity-20" />
                <h3 className="text-4xl font-black">طبلية</h3>
                <p className="text-xl opacity-80">أصل الأكل البيتي الحقيقي</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet the Chefs Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div className="text-right">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-secondary mb-4">تعرف على أفضل المطابخ</h2>
              <p className="text-stone-500 text-xl">أشطر ستات بيوت بيطبخوا بحب</p>
            </div>
            <Link to="/chefs" className="text-brand-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
              عرض كل المطابخ <ArrowRight size={20} />
            </Link>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-8 no-scrollbar">
            <div className="w-full py-12 text-center bg-stone-50 rounded-[32px] border border-dashed border-stone-200">
              <p className="text-stone-400 font-bold">جاري تجهيز قائمة بأفضل المطابخ...</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Shef Style */}
      <section className="py-24 bg-brand-cream/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-brand-secondary mb-20">إزاي طبلية بتشتغل؟</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { step: "1", title: "اختار وجبتك", desc: "تصفح مئات الوجبات البيتي من مطابخ قريبة منك.", icon: Utensils },
              { step: "2", title: "اطلب", desc: "حدد الوجبات اللي محتاجها للأسبوع كله في طلب واحد.", icon: Clock },
              { step: "3", title: "استمتع بالأكل", desc: "وجباتك هتوصلك طازجة، سخن واستمتع بطعم البيت.", icon: Heart }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center mx-auto mb-8 text-brand-primary">
                  <item.icon size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-stone-600 text-lg leading-relaxed">{item.desc}</p>
                {idx < 2 && (
                  <div className="hidden lg:block absolute top-12 -left-8 w-16 h-px bg-stone-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Tablia Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-secondary">ليه طبلية مش زي غيره؟</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { title: "طازة مش مجمد", desc: "كل أكلة بتتطبخ من الأول عشانك يوم بيوم.", icon: Utensils },
              { title: "أيادي ستات شاطرة", desc: "أختارنا المطابخ بعناية لضمان النفس الحلو.", icon: Award },
              { title: "نضافة مضمونة", desc: "بنفتش على كل مطبخ وبنتأكد من أعلى معايير النضافة.", icon: ShieldCheck },
              { title: "سعر على قد الإيد", desc: "أكلات بجودة عالية مقابل سعر يناسب ميزانيتك.", icon: Sparkles },
              { title: "توصيل سريع ومضمون", desc: "فريق توصيل مدرب بيوصلك الأكل سخن ومحفوظ صح.", icon: Clock }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 bg-brand-cream rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                  <item.icon size={36} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-stone-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Reviews Section */}
      <section className="py-24 bg-stone-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-right">
              <span className="text-brand-primary font-black tracking-[0.3em] uppercase text-sm mb-4 block">كلمات من القلب</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-brand-secondary">قالوا إيه عن <br /> طبلية؟</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-white px-4 py-2 rounded-2xl shadow-sm border border-stone-100">
                <Star className="fill-brand-primary text-brand-primary" size={20} />
                <span className="text-2xl font-black text-brand-secondary">4.9</span>
                <span className="text-stone-400 font-bold text-sm">/ 5</span>
              </div>
            </div>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-12 no-scrollbar">
            {[
              { 
                name: "سارة محمد", 
                comment: "المحشي طعمه زي بتاع ماما بالظبط، وصل سخن وفي ميعاده. شكراً طبلية!", 
                chef: "مطبخ الست أمينة",
                rating: 5,
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
              },
              { 
                name: "أحمد علي", 
                comment: "أول مرة أجرب المشويات وفوجئت بالنضافة والطعم الممتاز. الكفتة متبلة صح جداً.", 
                chef: "شواية الكابتن",
                rating: 5,
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
              },
              { 
                name: "منى محمود", 
                comment: "الحلويات الشرقية تجنن، البسبوسة مرملة وجميلة. التغليف شيك جداً ينفع للهدايا.", 
                chef: "حلويات ريم",
                rating: 4,
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
              },
              { 
                name: "ياسر إبراهيم", 
                comment: "خدمة توصيل سريعة والأكل وصل بجودته الكاملة. تجربة ممتازة وهكررها تاني.", 
                chef: "مطبخ ريفي",
                rating: 5,
                image: "https://images.unsplash.com/photo-1547037579-f0fc020ac3be?auto=format&fit=crop&q=80&w=200"
              }
            ].map((review, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="min-w-[350px] md:min-w-[450px] bg-white p-10 rounded-[40px] shadow-xl border border-stone-100 relative group"
              >
                <div className="absolute top-8 right-8 text-6xl text-brand-primary/10 font-serif leading-none opacity-0 group-hover:opacity-100 transition-opacity">"</div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-primary/20 shadow-lg">
                    <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-brand-secondary text-lg">{review.name}</h4>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-xl text-stone-600 leading-relaxed font-medium mb-8 italic">
                  "{review.comment}"
                </p>
                <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-400">تقييم لـ:</span>
                  <span className="bg-brand-primary/5 text-brand-primary px-4 py-1.5 rounded-full text-sm font-black">{review.chef}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Meals - Shef Grid Style */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div className="text-right">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-secondary mb-4">أشهر الأكلات النهاردة</h2>
              <p className="text-stone-500 text-xl">وجبات بيتي حقيقية بتدوب في البق</p>
            </div>
            <Link to="/meals" className="text-brand-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
              تصفح الاكلات كامل <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="col-span-full py-12 text-center bg-stone-50 rounded-[32px] border border-dashed border-stone-200">
              <p className="text-stone-400 font-bold">جاري تحديث قائمة الأكلات الأكثر طلباً...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Shef Style */}
      <section className="py-24 bg-brand-primary relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">
            سواء كنت تعبان من المطبخ، بعيد عن أهلك، أو عندك عزومة على آخر دقيقة — طبلية هنا.
          </h2>
          <p className="text-lg md:text-xl mb-10 opacity-90 font-medium">
            اطلب أكلتك دلوقتي — واتساب / تليفون
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <a href="https://wa.me/201107507344" target="_blank" rel="noopener noreferrer" className="bg-white text-brand-primary px-10 py-4 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-xl flex items-center gap-3">
              <MessageCircle size={24} />
              اطلب على واتساب
            </a>
            <Link to="/meals" className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-black text-xl hover:bg-white hover:text-brand-primary transition-all">
              تصفح الاكلات
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section - Shef Style */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-secondary mb-4">عندك استفسار؟</h2>
            <p className="text-stone-500 text-xl">كل اللي محتاج تعرفه عن طبلية</p>
          </div>

          <div className="space-y-6">
            {[
              { q: "إزاي بضمن إن الأكل نضيف؟", a: "كل شيف في طبلية بيعدي بمراحل تفتيش دقيقة على مطبخه، وبنتابع معاهم معايير النضافة العالمية بشكل دوري." },
              { q: "ممكن أطلب من أكتر من شيف في نفس المرة؟", a: "طبعاً! طبلية بتسمحلك تجمع وجباتك المفضلة من كذا شيف ويوصلولك كلهم في ميعاد واحد." },
              { q: "الأكل بيوصل سخن؟", a: "أكيد، فريق التوصيل بتاعنا بيستخدم شنط حرارية مخصوصة عشان الأكل يوصلك كأنه لسه طالع من الفرن." }
            ].map((faq, idx) => (
              <div key={idx} className="p-8 bg-stone-50 rounded-3xl border border-stone-100">
                <h3 className="text-xl font-bold text-stone-900 mb-4">{faq.q}</h3>
                <p className="text-stone-600 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/faq" className="text-brand-primary font-bold hover:underline">عرض كل الأسئلة الشائعة</Link>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <ChefMap />
    </div>
  );
}

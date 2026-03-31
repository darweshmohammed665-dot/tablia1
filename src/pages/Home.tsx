import { motion } from 'framer-motion';
import { Search, MapPin, Star, Clock, ChevronLeft, ArrowRight, Utensils, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChefMap from '../components/ChefMap';

export default function Home() {
  return (
    <div className="relative bg-white">
      {/* Hero Section - Global Elite Editorial */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-stone-950">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070" 
            alt="Luxury Food Presentation" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-stone-950 via-stone-950/40 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col items-start text-right">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-[1px] w-12 bg-brand-accent"></div>
              <span className="text-brand-accent font-black tracking-normal text-sm">تريند طنطا الأول</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[18vw] md:text-[10vw] font-black leading-[0.85] tracking-tighter text-white mb-8"
            >
              طبلية
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-xl md:text-4xl text-stone-400 max-w-2xl font-light leading-tight mb-12"
            >
              الأكل اللي <span className="text-white font-bold">بيخلص في ثانية</span>.. محشي، فطير، وحلويات معمولة بحب ونفس ملوش زي. طبلية هي الأصل والباقي تقليد!
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full sm:w-auto"
            >
              <Link to="/meals" className="group relative overflow-hidden bg-white text-stone-950 px-12 py-6 rounded-full font-black text-xl transition-all hover:pr-16 w-full sm:w-auto text-center">
                <span className="relative z-10">اكتشف القائمة</span>
                <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
              <Link to="/register?role=chef" className="text-white font-bold text-xl border-b-2 border-brand-primary pb-1 hover:text-brand-primary transition-colors">
                انضم للنخبة
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Vertical Rail Text */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:block">
          <p className="writing-mode-vertical text-stone-700 font-black tracking-[1em] uppercase text-[10px] rotate-180">
            ESTABLISHED IN TANTA • 2024 • THE AUTHENTIC EXPERIENCE
          </p>
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

      {/* Stats Section - Bento Style */}
      <section className="pt-48 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-10 flex flex-col items-center text-center group hover:bg-brand-primary transition-colors duration-500">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors">
                <Utensils size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">طهاة محترفون</h3>
              <p className="text-stone-500 group-hover:text-white/80 transition-colors">أكثر من 50 شيف من أمهر ستات البيوت في طنطا.</p>
            </div>
            <div className="glass-card p-10 flex flex-col items-center text-center group hover:bg-brand-secondary transition-colors duration-500">
              <div className="w-16 h-16 bg-brand-secondary/10 rounded-2xl flex items-center justify-center text-brand-secondary mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors">
                <Clock size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">توصيل سريع</h3>
              <p className="text-stone-500 group-hover:text-white/80 transition-colors">نصل إليك في أسرع وقت ممكن لضمان جودة الأكل.</p>
            </div>
            <div className="glass-card p-10 flex flex-col items-center text-center group hover:bg-brand-accent transition-colors duration-500">
              <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent mb-6 group-hover:bg-white/20 group-hover:text-stone-900 transition-colors">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-stone-900 transition-colors">جودة مضمونة</h3>
              <p className="text-stone-500 group-hover:text-stone-800 transition-colors">رقابة صارمة على معايير النظافة والجودة في كل مطبخ.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bento Grid */}
      <section className="py-24 bg-stone-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">نفسك في <span className="text-brand-accent italic">إيه؟</span></h2>
            <p className="text-stone-400 text-xl">من المحشي للفطير.. كل اللي قلبك يحبه موجود هنا.</p>
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

      {/* Featured Meals - Luxury Grid */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-6">
            <div className="text-right">
              <h2 className="text-5xl font-black text-stone-900 mb-4">الأكثر <span className="text-brand-primary">طلباً</span></h2>
              <p className="text-stone-500 text-xl">الأكلات اللي عاملة قلبان في طنطا اليومين دول</p>
            </div>
            <Link to="/meals" className="btn-secondary py-3 px-8 flex items-center gap-2">
              تصفح المنيو كامل <ChevronLeft size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: 'محشي ورق عنب بالريش', chef: 'أم أحمد', price: 250, rating: 4.9, img: 'https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?auto=format&fit=crop&q=80&w=800', tag: 'الأكثر طلباً' },
              { title: 'مكرونة بشاميل ملكي', chef: 'مطبخ هنا', price: 120, rating: 4.8, img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=800', tag: 'جديد' },
              { title: 'كفتة مشوية على الفحم', chef: 'الشيف محمد', price: 180, rating: 4.7, img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=800', tag: 'عرض خاص' },
            ].map((meal, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="relative h-[450px] rounded-[3rem] overflow-hidden shadow-2xl">
                  <img src={meal.img} alt={meal.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  
                  <div className="absolute top-6 right-6 bg-brand-accent text-stone-900 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    {meal.tag}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 text-right">
                    <div className="flex items-center justify-end gap-2 text-brand-accent mb-2">
                      <Star size={16} className="fill-brand-accent" />
                      <span className="font-bold">{meal.rating}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{meal.title}</h3>
                    <p className="text-stone-300 mb-6">بواسطة <span className="text-brand-accent font-bold">{meal.chef}</span></p>
                    
                    <div className="flex items-center justify-between">
                      <Link to="/checkout" className="bg-white text-stone-900 py-3 px-8 rounded-2xl font-bold hover:bg-brand-primary hover:text-white transition-all shadow-xl">
                        اشتري الآن
                      </Link>
                      <span className="text-2xl font-black text-white">{meal.price} ج.م</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ChefMap />

      {/* CTA Section - Immersive */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2rem] md:rounded-[4rem] overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center">
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=2070" 
              alt="Rural Cooking" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-brand-primary/80 backdrop-blur-sm"></div>
            
            <div className="relative z-10 p-8 md:p-24 text-right text-white max-w-3xl ml-auto">
              <h2 className="text-4xl md:text-8xl font-black mb-6 md:mb-8 leading-tight">
                عندك <span className="text-brand-accent italic">نفس</span> حريف؟ <br />
                افتحي مطبخك وورينا الشطارة
              </h2>
              <p className="text-lg md:text-2xl text-stone-100 mb-8 md:mb-12 leading-relaxed font-medium">
                انضمي لأكبر مجتمع حريفة في طنطا. وصلي طعمك لكل بيت وانتي في مكانك.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-end">
                <Link to="/register?role=chef" className="btn-primary bg-brand-accent text-stone-900 py-4 md:py-5 px-10 md:px-12 text-lg md:text-xl shadow-2xl text-center">
                  ابدأ بيع الآن
                </Link>
                <button className="bg-white/10 backdrop-blur-md border border-white/30 py-4 md:py-5 px-10 md:px-12 rounded-2xl font-bold hover:bg-white/20 transition-all text-lg md:text-xl">
                  اعرف أكتر
                </button>
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

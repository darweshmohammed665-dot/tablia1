import { motion, useScroll, useTransform } from 'motion/react';
import { Search, MapPin, Star, Clock, ChevronLeft, ArrowRight, Utensils, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChefMap from '../components/ChefMap';
import { useRef } from 'react';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div ref={containerRef} className="relative bg-brand-cream overflow-hidden">
      {/* Tarsh Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/10 rounded-full blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-secondary/10 rounded-full blob" style={{ animationDelay: '-5s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-brand-accent/10 rounded-full blob" style={{ animationDelay: '-10s' }}></div>
        <div className="absolute inset-0 bg-grain opacity-[0.03]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[90vh] md:h-[100vh] overflow-hidden bg-stone-950 flex items-center justify-center">
        {/* Background Image with Parallax and Subtle Zoom */}
        <motion.div 
          style={{ y }}
          animate={{ 
            scale: [1.05, 1.1, 1.05],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute inset-0 z-0 opacity-40"
        >
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2000" 
            alt="Home Cooked Food" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Sophisticated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/90 via-stone-950/20 to-stone-950"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 via-transparent to-stone-950/60"></div>
        </motion.div>

        {/* Grain Texture Overlay */}
        <div className="absolute inset-0 bg-grain opacity-[0.05] pointer-events-none z-[1]"></div>

        {/* Professional Hero Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs md:text-sm font-bold tracking-widest uppercase mb-8 backdrop-blur-md"
            >
              مرحباً بكم في طبلية طنطا
            </motion.span>
            
            <h1 className="text-[50px] md:text-[120px] font-black text-white leading-[0.9] tracking-tighter mb-8 drop-shadow-2xl">
              أصل الأكل <br />
              <span className="text-brand-primary italic font-serif">الفلاحي</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-stone-300 max-w-2xl mx-auto mb-12 font-medium leading-relaxed opacity-90">
              نقدم لكم تجربة طعام منزلية أصيلة، مطبوخة بكل حب من قلب طنطا إلى باب منزلكم.
            </p>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <Link 
                to="/meals" 
                className="group relative inline-flex items-center gap-3 bg-brand-primary text-white px-10 py-5 rounded-full font-black text-xl overflow-hidden transition-all hover:pr-14"
              >
                <span className="relative z-10">استكشف المنيو</span>
                <ArrowRight className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all duration-300" size={24} />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
              
              <button className="px-10 py-5 rounded-full border border-white/20 text-white font-bold text-xl backdrop-blur-md hover:bg-white/10 transition-colors">
                تعرف علينا
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/30 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">اسحب للأسفل</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"></div>
        </motion.div>

        {/* Subtle Floating Words (Professional Texture) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
          <motion.span 
            animate={{ y: [0, -40, 0], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-[20%] left-[10%] text-6xl font-black text-white/5 rotate-12"
          >
            نفس فلاحي
          </motion.span>
          <motion.span 
            animate={{ y: [0, 40, 0], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, delay: 1 }}
            className="absolute bottom-[30%] right-[15%] text-7xl font-black text-white/5 -rotate-12"
          >
            طعم زمان
          </motion.span>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="relative py-24 md:py-40 bg-brand-cream z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-brand-primary font-bold tracking-widest uppercase text-sm mb-4 block">قصتنا</span>
              <h2 className="text-4xl md:text-7xl font-black text-stone-900 mb-8 leading-tight">
                نعيد تعريف <br />
                <span className="text-brand-primary">الأكل البيتي</span> في طنطا
              </h2>
              <p className="text-lg md:text-xl text-stone-600 mb-10 leading-relaxed">
                في طبلية طنطا، نؤمن أن الأكل ليس مجرد وجبة، بل هو ذكرى وتاريخ. نحن نجمع أمهر الطهاة المنزليين لنقدم لكم أطباقاً تحمل عبق الريف المصري وأصالة مدينة طنطا.
              </p>
              <div className="flex flex-wrap gap-8">
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-brand-primary">150+</span>
                  <span className="text-stone-500 font-medium">شيف منزلي</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-brand-primary">12k+</span>
                  <span className="text-stone-500 font-medium">عميل سعيد</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-brand-primary">4.9</span>
                  <span className="text-stone-500 font-medium">تقييم عام</span>
                </div>
              </div>
            </motion.div>

            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-4">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
                    <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800" alt="Egyptian Chef 1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  </div>
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
                    <img src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=800" alt="Egyptian Chef 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  </div>
                </div>
                <div className="pt-12 space-y-4">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" alt="Egyptian Chef 3" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  </div>
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
                    <img src="https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?auto=format&fit=crop&q=80&w=800" alt="Egyptian Chef 4" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </motion.div>
              {/* Decorative Element */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-primary/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <div className="bg-[#4a1d2e] py-4 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 text-sm md:text-lg font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-brand-accent" />
            <span>آلاف الطهاة الموثوق بهم والذين تم فحصهم بدقة.</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <Star size={20} className="text-brand-accent" fill="currentColor" />
            <span>معدل قبول أقل من 5%</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-brand-primary font-bold tracking-widest uppercase text-sm mb-4 block">لماذا نحن؟</span>
            <h2 className="text-4xl md:text-6xl font-black text-stone-900 mb-6">نحن نهتم بكل تفصيلة</h2>
            <p className="text-lg text-stone-600">نحن لا نقدم الطعام فقط، بل نقدم الجودة والأمان والحب في كل وجبة.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: Utensils, title: "جودة استثنائية", desc: "نختار أفضل المكونات الطازجة يومياً لضمان طعم لا يقاوم." },
              { icon: Heart, title: "مطبوخ بحب", desc: "طهاة منزليون يطبخون وجباتكم بنفس الشغف الذي يطبخون به لعائلاتهم." },
              { icon: ShieldCheck, title: "أمان تام", desc: "فحص دوري وصارم لجميع المطابخ لضمان أعلى معايير النظافة." },
              { icon: Star, title: "تميز دائم", desc: "نسعى دائماً لتقديم الأفضل وتجاوز توقعاتكم في كل طلب." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 rounded-3xl bg-brand-cream/50 hover:bg-brand-primary hover:text-white transition-all duration-500"
              >
                <div className="w-16 h-16 mb-8 text-brand-primary group-hover:text-white transition-colors">
                  <feature.icon size={64} strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                <p className="text-stone-600 group-hover:text-white/80 transition-colors leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-brand-cream/30 border-y border-stone-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-16">
            موثوق به من قبل أكثر من <span className="text-brand-primary">180 ألف أسرة</span>
          </h2>
          
          <div className="relative px-12">
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={24} className="text-brand-accent mx-0.5" fill="currentColor" />
              ))}
            </div>
            
            <blockquote className="text-2xl md:text-3xl font-medium text-stone-700 leading-relaxed mb-8 italic">
              "أحب برنامج طبلية! لقد جرب أطفالي أطعمة جديدة، وأشعر أننا جميعاً نأكل طعاماً جيداً جداً مقابل وقت وجهد أقل مني."
            </blockquote>
            
            <div className="text-stone-500">
              <p className="font-bold text-lg">جيني س.</p>
              <p>منطقة خليج طنطا</p>
            </div>

            <button className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-stone-200 text-stone-400 hover:bg-white transition-colors">
              <ChevronLeft size={24} />
            </button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-stone-200 text-stone-400 hover:bg-white transition-colors rotate-180">
              <ChevronLeft size={24} />
            </button>
          </div>
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
      <section className="py-24 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-right">
              <span className="text-brand-primary font-bold tracking-widest uppercase text-sm mb-4 block">التصنيفات</span>
              <h2 className="text-5xl md:text-7xl font-black text-stone-900">أقسامنا المميزة</h2>
            </div>
            <Link to="/meals" className="text-brand-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
              عرض الكل <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[350px]">
            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-2 rounded-[2.5rem] overflow-hidden relative group shadow-xl"
            >
              <img src="https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Mahshi" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end text-white">
                <h3 className="text-4xl font-black mb-2">المحاشي الفلاحي</h3>
                <p className="text-white/80 font-medium">من قلب الغيط لسفرتك</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-2 rounded-[2.5rem] overflow-hidden relative group shadow-xl"
            >
              <img src="https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Feteer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end text-white">
                <h3 className="text-4xl font-black mb-2">فطير مشلتت</h3>
                <p className="text-white/80 font-medium">بالسمن البلدي الأصلي</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-1 rounded-[2.5rem] overflow-hidden relative group shadow-xl"
            >
              <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Desserts" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end text-white">
                <h3 className="text-2xl font-black">حلويات</h3>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-2 rounded-[2.5rem] bg-brand-primary p-12 flex flex-col justify-center text-white relative overflow-hidden group shadow-xl"
            >
              <div className="relative z-10">
                <h3 className="text-4xl font-black mb-4">اكتشف المزيد</h3>
                <p className="text-lg opacity-80 mb-8">أكثر من 20 قسم متنوع بانتظارك لتجربة فريدة!</p>
                <Link to="/meals" className="inline-flex items-center gap-2 bg-white text-brand-primary px-8 py-3 rounded-full font-bold hover:bg-stone-100 transition-colors">
                  تصفح الأقسام <ArrowRight size={18} />
                </Link>
              </div>
              <Utensils className="absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 transition-transform duration-500" size={250} />
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-1 rounded-[2.5rem] overflow-hidden relative group shadow-xl"
            >
              <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Soups" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end text-white">
                <h3 className="text-2xl font-black">شوربات</h3>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trending Meals */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-right">
              <span className="text-brand-primary font-bold tracking-widest uppercase text-sm mb-4 block">الأكثر طلباً</span>
              <h2 className="text-5xl md:text-7xl font-black text-stone-900">تريند النهاردة 🔥</h2>
            </div>
            <Link to="/meals" className="text-brand-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
              عرض كل الوجبات <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { id: 1, name: "صينية محشي مشكل", price: "180", img: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=800" },
              { id: 2, name: "فطير مشلتت بالسمن", price: "120", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800" },
              { id: 3, name: "بط محمر بالمرتة", price: "450", img: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&q=80&w=800" }
            ].map((meal) => (
              <motion.div 
                key={meal.id} 
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-stone-100 group"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={meal.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={meal.name} />
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-black text-brand-primary shadow-lg">
                    {meal.price} ج.م
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black text-stone-900 mb-6">{meal.name}</h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-stone-500 font-medium">
                      <Clock size={18} />
                      <span>45-60 دقيقة</span>
                    </div>
                    <button className="bg-brand-primary text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-brand-primary/30">
                      اطلب الآن
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-stone-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=2000" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl md:text-8xl font-black text-white mb-12 leading-tight">
            جاهز لتجربة <br />
            <span className="text-brand-primary italic font-serif">أصل الأكل؟</span>
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <Link to="/meals" className="bg-brand-primary text-white px-12 py-6 rounded-full font-black text-2xl hover:scale-105 transition-transform shadow-2xl shadow-brand-primary/40">
              ابدأ طلبك الآن
            </Link>
            <button className="text-white font-bold text-xl border-b-2 border-brand-primary pb-1 hover:text-brand-primary transition-colors">
              تواصل معنا للاستفسارات
            </button>
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

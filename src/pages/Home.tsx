import { motion, useScroll, useTransform } from 'motion/react';
import { ShoppingBag, Clock, ArrowRight, MessageCircle, Utensils, Heart, Star, ShieldCheck, ChevronLeft, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChefMap from '../components/ChefMap';
import { useRef } from 'react';
import { CHEF_IMAGE_URL } from '../constants';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export default function Home() {
  const { addToCart } = useCart();
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
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-brand-peach/20 rounded-full blob" style={{ animationDelay: '-10s' }}></div>
        <div className="absolute inset-0 bg-grain opacity-[0.03]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden cool-bg flex items-center">
        {/* Background Image with Immersive Effects */}
        <motion.div 
          style={{ y }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1541518763669-279f00ed4242?auto=format&fit=crop&q=80&w=2000" 
            alt="Premium Egyptian Food Spread" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-secondary/60 via-transparent to-brand-secondary/80"></div>
        </motion.div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 text-right">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="inline-block px-6 py-2 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-brand-primary text-sm font-black tracking-[0.2em] uppercase mb-8 backdrop-blur-xl">
                  تراث طنطا في كل لقمة
                </span>
                
                <h1 className="text-[60px] md:text-[140px] font-black text-white leading-[0.85] tracking-[-0.04em] mb-10">
                  تعبت من <br />
                  <span className="text-brand-primary italic font-serif">أكل الشارع؟</span>
                </h1>
                
                <p className="text-xl md:text-3xl text-white/70 max-w-2xl ml-auto mb-12 font-medium leading-tight">
                  طبلية بيوصلك أكل بيت حقيقي، من مطبخ ست شاطرة، بأحسن جودة وأقل سعر ولحد باب بيتك في طنطا.
                </p>

                <div className="flex flex-col md:flex-row-reverse items-center gap-6">
                  <Link 
                    to="/meals" 
                    className="btn-primary text-2xl px-12 py-6 group"
                  >
                    استكشف الأكلات
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={28} />
                  </Link>
                  
                  <Link 
                    to="/about"
                    className="px-12 py-6 rounded-[16px] border-2 border-white/10 text-white font-bold text-2xl backdrop-blur-md hover:bg-white/5 transition-all"
                  >
                    تعرف علينا
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-4 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-[3/4] rounded-[40px] overflow-hidden border-8 border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 bg-brand-secondary">
                   <img 
                    src={CHEF_IMAGE_URL} 
                    className="w-full h-full object-cover object-[50%_50%] opacity-80 hover:opacity-100 transition-all duration-700"
                    alt="Our Chefs"
                  />
                </div>
                <div className="absolute -bottom-10 -left-10 glass-card p-8 rotate-[-6deg] bg-brand-primary text-white border-none">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <Heart size={24} fill="currentColor" />
                    </div>
                    <span className="font-black text-xl">+12k</span>
                  </div>
                  <p className="text-white/80 font-bold text-sm">طلب ناجح في طنطا</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/20 flex flex-col items-center gap-2"
        >
          <div className="w-px h-20 bg-gradient-to-b from-white/40 to-transparent"></div>
        </motion.div>
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
              <span className="text-brand-primary font-bold tracking-widest uppercase text-sm mb-4 block">قصة طبلية</span>
              <h2 className="text-4xl md:text-7xl font-black text-stone-900 mb-8 leading-tight">
                من قلب طنطا <br />
                <span className="text-brand-primary">لكل بيت</span>
              </h2>
              <p className="text-lg md:text-xl text-stone-600 mb-10 leading-relaxed">
                في طنطا، كل شارع فيه بيت ريحة أكله بتجوع الجيران، وفي كل بيت ست شاطرة نفسها أكلها وحلاوة نفسها يوصلوا للناس. وفي نفس الشارع.. موظف راجع مهدود، أو أم وراها ألف حاجة، ونفسهم في لقمة بيتي ترم العظم من غير فرهدة المطبخ أو أسعار الدليفري اللي بتخلص المرتب.
                <br /><br />
                من هنا بدأت طبلية.. قررنا نكون حلقة الوصل اللي بتريح الطرفين. قفلنا دايرة التعب، وفتحنا مطابخ أشطر ستات في طنطا عشان تجبلك أكل بيتي بجودة عالية ونضافة وسعر على قد الإيد.
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
                    <img src={CHEF_IMAGE_URL} alt="Chef 1" className="w-full h-full object-cover object-[10%_50%] hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  </div>
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
                    <img src={CHEF_IMAGE_URL} alt="Chef 2" className="w-full h-full object-cover object-[50%_50%] hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  </div>
                </div>
                <div className="pt-12 space-y-4">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
                    <img src={CHEF_IMAGE_URL} alt="Chef 3" className="w-full h-full object-cover object-[90%_50%] hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  </div>
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
                    <img src={CHEF_IMAGE_URL} alt="Chef 4" className="w-full h-full object-cover object-[30%_50%] hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
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
      <div className="bg-brand-secondary py-4 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 text-sm md:text-lg font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-brand-peach" />
            <span>طازج يومياً</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <Utensils size={20} className="text-brand-peach" />
            <span>مطبوخ بأيادي أشطر ستات بيوت</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-brand-peach" />
            <span>نضيف ومضمون</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-brand-peach" />
            <span>توصيل سريع في طنطا</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-brand-primary font-bold tracking-widest uppercase text-sm mb-4 block">ليه طبلية؟</span>
            <h2 className="text-4xl md:text-6xl font-black text-stone-900 mb-6">ليه طبلية مش زي غيره؟</h2>
            <p className="text-lg text-stone-600">أول منصة في طنطا للأكل البيتي، مكونات مضمونة، ونضافة، وسعر على قد الإيد.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { icon: Utensils, title: "طازة مش مجمد", desc: "كل أكلة بتتطبخ من الأول عشانك" },
              { icon: Heart, title: "أيادي ستات شاطرة", desc: "أختارنا الطباخات بعناية" },
              { icon: ShieldCheck, title: "نضافة مضمونة", desc: "معايير نظافة صارمة ومتابعة دورية" },
              { icon: ShoppingBag, title: "سعر على قد الإيد", desc: "أكلات بجودة عالية مقابل سعر على قد الإيد" },
              { icon: Clock, title: "توصيل سريع في طنطا", desc: "وجبتك هتوصلك سخنة وفي ميعادها" }
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
      <section className="py-24 bg-brand-peach/30 border-y border-stone-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-16">
            موثوق به من قبل أكثر من <span className="text-brand-primary">180 ألف أسرة</span>
          </h2>
          
          <div className="relative px-12">
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={24} className="text-brand-primary mx-0.5" fill="currentColor" />
              ))}
            </div>
            
            <blockquote className="text-2xl md:text-3xl font-medium text-stone-700 leading-relaxed mb-8 italic">
              "بجد يا جماعة طبلية دي اختراع! الأكل واصل سخن ونفسه يجنن، كأني باكل في بيت جدي بالظبط. طنطا فعلاً فيها حريفة."
            </blockquote>
            
            <div className="text-stone-500">
              <p className="font-bold text-lg text-brand-secondary">سارة م.</p>
              <p>بلوجر طعام - طنطا</p>
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
              <span className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter">أقوى أكل بيتي في مصر</span>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-brand-peach rounded-full"></div>
              <span className="text-3xl md:text-6xl font-black text-brand-primary uppercase tracking-tighter">طنطا بتطبخ صح</span>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-stone-900 mb-4">
              طاهٍ شخصي في <br className="md:hidden" />
              <span className="text-brand-primary">4 خطوات بسيطة</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                text: "يقوم فريقنا بالعثور على أفضل الطهاة المنزليين في منطقتك والتحقق من جودة مطابخهم.",
                img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800"
              },
              {
                step: "2",
                text: "شاركنا تفضيلاتك وقم بمزج وتنسيق الوجبات من الطهاة المحليين كل أسبوع.",
                img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800"
              },
              {
                step: "3",
                text: "يقوم طهاتكم بإعداد وجبات طازجة بكميات صغيرة لـ 5-10 أسر يومياً.",
                img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800"
              },
              {
                step: "4",
                text: "نحن نوصل إليك الطعام - ما عليك سوى تسخينه والاستمتاع بوجبات منزلية الصنع بدون أي عناء!",
                img: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&q=80&w=800"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative group"
              >
                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl mb-6">
                  <img 
                    src={item.img} 
                    alt={`Step ${item.step}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white p-6 rounded-3xl shadow-xl border border-stone-100 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex gap-4 items-start">
                    <span className="text-5xl font-black text-brand-primary leading-none">{item.step}</span>
                    <p className="text-stone-700 font-bold leading-relaxed text-sm md:text-base">
                      {item.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <Link to="/meals" className="inline-flex items-center gap-3 bg-brand-primary text-white px-12 py-5 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-xl">
              استكشف خدمة التوصيل الأسبوعي
              <ArrowRight size={24} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Categories */}
      <section className="py-32 bg-brand-peach/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="text-right">
              <span className="text-brand-primary font-black tracking-[0.3em] uppercase text-sm mb-6 block">لمحة من المنيو</span>
              <h2 className="text-6xl md:text-[90px] font-black text-brand-secondary leading-[0.9] tracking-tighter">عندنا ايه <br /> النهاردة؟</h2>
            </div>
            <Link to="/meals" className="btn-secondary group">
              عرض الكل 
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[400px]">
            <motion.div 
              whileHover={{ y: -15 }}
              className="md:col-span-8 rounded-[40px] overflow-hidden relative group shadow-2xl"
            >
              <img src="https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Mahshi" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary via-brand-secondary/20 to-transparent p-12 flex flex-col justify-end text-white">
                <h3 className="text-5xl md:text-7xl font-black mb-4">المحاشي الفلاحي</h3>
                <p className="text-white/70 text-xl font-medium">من قلب الغيط لسفرتك، طعم ملوش زي</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -15 }}
              className="md:col-span-4 rounded-[40px] overflow-hidden relative group shadow-2xl"
            >
              <img src="https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Feteer" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary via-brand-secondary/20 to-transparent p-10 flex flex-col justify-end text-white">
                <h3 className="text-4xl font-black mb-2">فطير مشلتت</h3>
                <p className="text-white/70 font-medium">بالسمن البلدي الأصلي</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -15 }}
              className="md:col-span-4 rounded-[40px] overflow-hidden relative group shadow-2xl"
            >
              <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Desserts" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary via-brand-secondary/20 to-transparent p-10 flex flex-col justify-end text-white">
                <h3 className="text-4xl font-black">حلويات</h3>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -15 }}
              className="md:col-span-4 rounded-[40px] bg-brand-primary p-12 flex flex-col justify-center text-white relative overflow-hidden group shadow-2xl"
            >
              <div className="relative z-10">
                <h3 className="text-5xl font-black mb-6">اكتشف <br /> المزيد</h3>
                <p className="text-xl opacity-80 mb-10">أكثر من 20 قسم متنوع بانتظارك لتجربة فريدة!</p>
                <Link to="/meals" className="inline-flex items-center gap-3 bg-white text-brand-primary px-10 py-4 rounded-full font-black text-lg hover:bg-brand-cream transition-colors">
                  تصفح الأقسام <ArrowRight size={22} />
                </Link>
              </div>
              <Utensils className="absolute -bottom-20 -right-20 text-white/10 group-hover:scale-110 transition-transform duration-1000" size={350} />
            </motion.div>

            <motion.div 
              whileHover={{ y: -15 }}
              className="md:col-span-4 rounded-[40px] overflow-hidden relative group shadow-2xl"
            >
              <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Soups" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary via-brand-secondary/20 to-transparent p-10 flex flex-col justify-end text-white">
                <h3 className="text-4xl font-black">شوربات</h3>
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
                    <button 
                      onClick={() => {
                        addToCart({
                          id: meal.id.toString(),
                          title: meal.name,
                          price: parseInt(meal.price),
                          quantity: 1,
                          image: meal.img,
                          chefId: "chef1", // Placeholder
                          chefName: "شيف طبلية" // Placeholder
                        });
                        toast.success(`تم إضافة ${meal.name} إلى السلة`);
                      }}
                      className="bg-brand-primary text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-brand-primary/30 flex items-center gap-2"
                    >
                      <ShoppingBag size={18} />
                      أضف للسلة
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
        <div className="absolute inset-0 opacity-60">
          <img src="https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&q=80&w=2000" alt="Artistic Spices and Ingredients" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl md:text-8xl font-black text-white mb-12 leading-tight">
            سواء كنت تعبان من المطبخ، <br />
            <span className="text-brand-primary italic font-serif">طبلية هنا.</span>
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <Link to="/meals" className="bg-brand-primary text-white px-12 py-6 rounded-full font-black text-2xl hover:scale-105 transition-transform shadow-2xl shadow-brand-primary/40">
              اطلب أكلتك دلوقتي
            </Link>
            <a href="https://wa.me/201234567890" className="text-white font-bold text-xl border-b-2 border-brand-primary pb-1 hover:text-brand-primary transition-colors">
              واتساب / تليفون
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-stone-900 mb-4">الأسئلة الشائعة</h2>
            <p className="text-stone-500 text-xl">كل ما تحتاج معرفته عن تجربة طبلية</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "كيف تعمل منصة طبلية؟", a: "طبلية هي منصة رائدة تربطكم بنخبة من أمهر الطهاة المنزليين في طنطا، حيث يتم إعداد وجباتكم طازجة وبأعلى معايير الجودة." },
              { q: "ما هي خيارات التوصيل المتاحة؟", a: "نحن نوفر خيارات توصيل مرنة تشمل التوصيل الفوري أو الجدولة المسبقة لوجبات الأسبوع بالكامل لتناسب جدولكم المزدحم." },
              { q: "كيف نضمن جودة الطهاة؟", a: "نطبق معايير اختيار دقيقة تشمل فحص المهارات والالتزام الصارم ببروتوكولات النظافة والسلامة الغذائية في كافة المطابخ." },
              { q: "هل يمكنني تخصيص طلبي؟", a: "بالتأكيد، تمنحكم طبلية حرية اختيار وتنسيق وجبات من طهاة مختلفين، مع إمكانية التواصل المباشر لمناقشة أي تفضيلات خاصة." }
            ].map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-brand-cream/30 rounded-3xl p-8 border border-stone-100"
              >
                <h3 className="text-xl font-bold text-brand-accent mb-4">{faq.q}</h3>
                <p className="text-stone-600 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center flex flex-col items-center gap-6">
            <Link to="/faq" className="inline-flex items-center gap-2 text-brand-primary font-bold hover:gap-4 transition-all">
              عرض كل الأسئلة <ArrowRight size={20} />
            </Link>
            
            <div className="mt-8 p-8 bg-brand-cream/50 rounded-[2rem] border border-stone-100 max-w-lg w-full">
              <p className="text-stone-500 font-bold mb-4 uppercase tracking-wider">لسه عندك أسئلة؟</p>
              <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-stone-100 text-brand-accent py-4 rounded-2xl font-bold hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm">
                <MessageCircle size={20} />
                تحدث معنا الآن
              </button>
            </div>
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

import { motion, useScroll, useTransform } from 'motion/react';
import { ShoppingBag, Clock, ArrowRight, MessageCircle, Utensils, Heart, Star, ShieldCheck, ChevronLeft, MapPin, Flame, Award, Sparkles } from 'lucide-react';
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
    <div ref={containerRef} className="relative bg-brand-cream overflow-hidden selection:bg-brand-primary selection:text-white">
      {/* Background Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.03] bg-grain"></div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-brand-cream flex items-center egyptian-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="text-right lg:col-span-5 lg:order-1 order-2">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="text-[50px] md:text-[80px] font-black text-brand-secondary leading-[1.1] tracking-[-0.02em] mb-6">
                  تعبت من <br />
                  <motion.span 
                    animate={{ color: ['#E14F33', '#2D2D2D', '#E14F33'] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="italic font-serif"
                  >أكل الشارع؟</motion.span>
                </h1>
                
                <p className="text-xl md:text-2xl text-stone-600 max-w-lg ml-auto mb-6 font-medium leading-relaxed">
                  طبلية بيوصلك أكل بيت حقيقي، من مطبخ ست شاطرة، بأحسن جودة وأقل سعر ولحد باب بيتك في طنطا.
                </p>

                <p className="text-lg md:text-xl text-brand-primary max-w-lg ml-auto mb-10 font-bold leading-relaxed border-r-4 border-brand-primary pr-4">
                  أول منصة في طنطا للأكل البيتي، مكونات مضمونة، ونضافة، وسعر على قد الإيد.
                </p>

                <div className="flex flex-col sm:flex-row-reverse items-center gap-4 justify-start">
                  <Link 
                    to="/meals" 
                    className="btn-primary text-xl px-10 py-5 w-full sm:w-auto group"
                  >
                    اطلب دلوقتي!
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                  </Link>
                  
                  <a 
                    href="https://wa.me/201234567890"
                    className="px-10 py-5 rounded-[16px] border-2 border-stone-200 text-brand-secondary font-bold text-xl hover:border-brand-primary hover:text-brand-primary transition-all w-full sm:w-auto text-center flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm"
                  >
                    اتصل بينا - واتساب
                  </a>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-7 lg:order-2 order-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="aspect-[4/3] md:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                   <img 
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200" 
                    className="w-full h-full object-cover animate-subtle-zoom"
                    alt="Home Cooked Food"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Floating Badges */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 hidden md:flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="font-bold text-stone-800">نضافة مضمونة 100%</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="relative py-24 md:py-40 bg-white z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-brand-primary font-bold tracking-[0.3em] uppercase text-sm mb-4 block">قصة طبلية</span>
              <h2 className="text-4xl md:text-7xl font-black text-stone-900 mb-8 leading-tight">
                من قلب طنطا <br />
                <span className="text-brand-primary italic font-serif">لكل بيت</span>
              </h2>
              <p className="text-lg md:text-xl text-stone-600 mb-10 leading-relaxed font-medium">
                في طنطا، كل شارع فيه بيت ريحة أكله بتجوع الجيران، وفي كل بيت ست شاطرة نفسها أكلها وحلاوة نفسها يوصلوا للناس. وفي نفس الشارع.. موظف راجع مهدود، أو أم وراها ألف حاجة، ونفسهم في لقمة بيتي ترم العظم من غير فرهدة المطبخ أو أسعار الدليفري اللي بتخلص المرتب.
                <br /><br />
                من هنا بدأت طبلية.. قررنا نكون حلقة الوصل اللي بتريح الطرفين. قفلنا دايرة التعب، وفتحنا مطابخ أشطر ستات في طنطا عشان تجبلك أكل بيتي بجودة عالية ونضافة وسعر على قد الإيد، وعلشان تساعد كل ست بيت نفسها تفتح مشروعها الخاص من مطبخها.
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
      <div className="bg-brand-peach py-6 text-brand-secondary overflow-hidden border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 text-sm md:text-lg font-bold">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} className="text-brand-primary" />
            <span>طازج يومياً</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-stone-300"></div>
          <div className="flex items-center gap-3">
            <Utensils size={24} className="text-brand-primary" />
            <span>مطبوخ بأيادي أشطر ستات بيوت</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-stone-300"></div>
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} className="text-brand-primary" />
            <span>نضيف ومضمون</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-stone-300"></div>
          <div className="flex items-center gap-3">
            <Clock size={24} className="text-brand-primary" />
            <span>توصيل سريع في طنطا</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-32 bg-brand-peach/30 egyptian-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-stone-900 mb-6">ليه طبلية مش زي غيره؟</h2>
            <div className="w-24 h-1 bg-brand-primary mx-auto rounded-full"></div>
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
                className="group p-8 rounded-[32px] bg-white hover:bg-brand-primary hover:text-white transition-all duration-500 shadow-xl shadow-stone-200/50 hover:shadow-brand-primary/30"
              >
                <div className="w-16 h-16 mb-8 text-brand-primary group-hover:text-white transition-colors bg-brand-primary/5 group-hover:bg-white/20 rounded-2xl flex items-center justify-center">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                <p className="text-stone-600 group-hover:text-white/80 transition-colors leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Trending Marquee - Global Style */}
      <div className="bg-brand-primary py-6 md:py-8 overflow-hidden z-30 relative">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 md:gap-20 mx-5 md:mx-10">
              <span className="text-2xl md:text-4xl font-black text-white/30 uppercase tracking-tighter">TABLIYA TANTA</span>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
              <span className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">أقوى أكل بيتي في مصر</span>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-brand-secondary rounded-full"></div>
              <span className="text-2xl md:text-4xl font-black text-brand-secondary uppercase tracking-tighter">طنطا بتطبخ صح</span>
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
              شوف المنيو كامل 
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
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-stone-100 group relative"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={meal.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={meal.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Attention Grabbing Badge */}
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-black shadow-lg flex items-center gap-1.5 animate-pulse">
                    <Flame size={16} className="fill-current" /> الأكثر مبيعاً
                  </div>

                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-brand-primary shadow-lg text-lg">
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
      <section className="py-32 bg-brand-peach relative overflow-hidden border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-brand-secondary mb-8 leading-tight">
            سواء كنت تعبان من المطبخ، بعيد عن أهلك، <br />
            <span className="text-brand-primary">أو عندك عزومة على آخر دقيقة — طبلية هنا.</span>
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12">
            <Link to="/meals" className="btn-primary text-2xl px-12 py-6">
              اطلب أكلتك دلوقتي
            </Link>
            <a href="https://wa.me/201234567890" className="px-12 py-6 rounded-[16px] border-2 border-stone-300 text-brand-secondary font-bold text-2xl hover:border-brand-primary hover:text-brand-primary transition-all bg-white">
              واتساب / تليفون
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Experience Promo */}
      <section className="py-24 bg-brand-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{ 
            backgroundImage: 'radial-gradient(circle at 50% 50%, #E14F33 0%, transparent 50%)',
            filter: 'blur(100px)'
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-right">
              <span className="text-brand-primary font-black tracking-[0.3em] uppercase text-sm mb-6 block">تجربة فريدة</span>
              <h2 className="text-5xl md:text-8xl font-black text-white mb-8 leading-tight">
                تحكم في <span className="text-brand-primary italic font-serif">النجوم</span> <br /> بحركة يدك
              </h2>
              <p className="text-xl md:text-2xl text-white/70 mb-12 font-medium leading-relaxed">
                جرب تقنية طبلية الجديدة للتحكم التفاعلي. استخدم كاميرا موبايلك وحرك إيدك في الهوا عشان تتحكم في سديم طبلية الذهبي. تجربة سحرية مش هتلاقيها غير عندنا.
              </p>
              <Link to="/interactive" className="btn-primary text-2xl px-12 py-6 inline-flex items-center gap-4 group">
                ابدأ التجربة السحرية
                <Sparkles className="group-hover:rotate-12 transition-transform" size={28} />
              </Link>
            </div>
            <div className="relative">
              <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="aspect-square rounded-[60px] bg-gradient-to-br from-brand-primary/20 to-transparent border border-white/10 backdrop-blur-3xl flex items-center justify-center p-12 overflow-hidden"
              >
                <div className="relative w-full h-full">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.8, 0.3],
                        x: [0, (Math.random() - 0.5) * 100, 0],
                        y: [0, (Math.random() - 0.5) * 100, 0]
                      }}
                      transition={{ 
                        duration: 3 + Math.random() * 2, 
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                      className="absolute bg-brand-primary rounded-full blur-sm"
                      style={{
                        width: Math.random() * 10 + 5 + 'px',
                        height: Math.random() * 10 + 5 + 'px',
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%'
                      }}
                    />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 bg-brand-primary rounded-full blur-[80px] opacity-30"></div>
                    <span className="text-9xl">☝️</span>
                  </div>
                </div>
              </motion.div>
            </div>
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

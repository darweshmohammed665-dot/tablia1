import { motion, useScroll, useTransform } from 'motion/react';
import { ShoppingBag, Clock, ArrowRight, MessageCircle, Utensils, Heart, Star, ShieldCheck, ChevronLeft, MapPin, Flame, Award, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChefMap from '../components/ChefMap';
import { MealCard } from '../components/MealCard';
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

      {/* Hero Section - Shef Style */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Egyptian Home Cooking"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight"
          >
            تعبت من أكل الشارع؟ <br />
            <span className="italic italic-arabic text-brand-primary">طبلية بيوصلك أكل بيت حقيقي</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-white/90 mb-10 font-medium leading-relaxed"
          >
            من مطبخ ست شاطرة، بأحسن جودة وأقل سعر ولحد باب بيتك في طنطا.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-2 rounded-full shadow-2xl flex items-center max-w-2xl mx-auto mb-12"
          >
            <div className="flex-grow flex items-center px-6 gap-3 border-l border-stone-200">
              <MapPin className="text-brand-primary" size={24} />
              <input 
                type="text" 
                placeholder="دخل منطقتك في طنطا..." 
                className="w-full py-4 outline-none text-xl font-medium text-stone-800"
              />
            </div>
            <Link to="/meals" className="bg-brand-primary text-white px-10 py-4 rounded-full font-black text-xl hover:bg-brand-primary/90 transition-all">
              اكتشف الأكل
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              "طازج يومياً",
              "مطبوخ بأيادي أشطر ستات بيوت",
              "نضيف ومضمون",
              "توصيل سريع في طنطا"
            ].map((badge, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm font-bold flex items-center justify-center gap-2">
                <ShieldCheck size={16} className="text-brand-primary" />
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories & Search Tags Section */}
      <section className="py-12 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          {/* What are you craving today? */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-stone-900 mb-6 text-right">ماذا تشتهي اليوم؟</h2>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar justify-start md:justify-end flex-row-reverse">
              {[
                { name: "حلويات", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=200" },
                { name: "مخبوزات", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=200" },
                { name: "طواجن", img: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=200" },
                { name: "مشويات", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=200" },
                { name: "محاشي", img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=200" }
              ].map((cat, i) => (
                <Link to={`/meals?category=${cat.name}`} key={i} className="flex flex-col items-center gap-3 min-w-[90px] group">
                  <div className="w-24 h-24 rounded-full overflow-hidden shadow-sm border-4 border-transparent group-hover:border-brand-primary transition-all duration-300">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <span className="font-bold text-stone-800 text-sm group-hover:text-brand-primary transition-colors">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Most Searched */}
          <div>
            <h2 className="text-2xl font-black text-stone-900 mb-6 text-right">الأكثر بحثاً على طبلية</h2>
            <div className="flex flex-wrap gap-3 justify-end">
              {['بيتزا', 'كشري', 'مشويات', 'حلويات النصر', 'كريب', 'برجر'].map((tag, i) => (
                <Link to={`/meals?search=${tag}`} key={i} className="px-5 py-2.5 bg-stone-50 rounded-full border border-stone-200 text-stone-700 font-bold text-sm hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-colors flex items-center gap-2 shadow-sm">
                  <span className="text-brand-primary bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm">📈</span> {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Big Stores Near You */}
          <div className="mt-12">
            <h2 className="text-2xl font-black text-stone-900 mb-6 text-right">أشهر الطباخين بالقرب منك</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar justify-end flex-row-reverse">
              {[
                { name: "شيف فاطمة", img: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200", time: "30 دقيقة" },
                { name: "مطبخ الست غالية", img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200", time: "45 دقيقة" },
                { name: "أكلات زمان", img: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=200", time: "25 دقيقة" },
                { name: "شيف حسن", img: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&q=80&w=200", time: "40 دقيقة" },
                { name: "مطبخ أم علي", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=200", time: "35 دقيقة" }
              ].map((store, i) => (
                <Link to="/chefs" key={i} className="min-w-[120px] bg-white rounded-2xl p-3 border border-stone-100 shadow-sm hover:shadow-md transition-all group text-center">
                  <div className="w-16 h-16 mx-auto rounded-xl overflow-hidden mb-3 border border-stone-100">
                    <img src={store.img} alt={store.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-bold text-stone-800 text-sm mb-1 truncate">{store.name}</h4>
                  <p className="text-xs text-stone-500 flex items-center justify-center gap-1">
                    <Clock size={12} /> {store.time}
                  </p>
                </Link>
              ))}
            </div>
          </div>
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
                  في طنطا، كل شارع فيه بيت ريحة أكله بتجوع الجيران، وفي كل بيت ست شاطرة نفسها أكلها وحلاوة نفسها يوصلوا للناس.
                </p>
                <p>
                  وفي نفس الشارع.. موظف راجع مهدود، أو أم وراها ألف حاجة، ونفسهم في لقمة بيتي ترم العضم من غير فرهدة المطبخ أو أسعار الدليفري اللي بتخلص المرتب.
                </p>
                <p>
                  من هنا بدأت طبلية.. قررنا نكون حلقة الوصل اللي بتريح الطرفين. قفلنا دايرة التعب، وفتحنا مطابخ أشطر ستات في طنطا عشان تجبلك أكل بيتي بجودة عالية ونضافة وسعر على قد الإيد، وعلشان تساعد كل ست بيت نفسها تفتح مشروعها الخاص من مطبخها.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[40px] overflow-hidden shadow-2xl aspect-square"
            >
              <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-full object-cover"
                alt="Egyptian Kitchen"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet the Chefs Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div className="text-right">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-secondary mb-4">تعرف على أفضل طهاة طنطا</h2>
              <p className="text-stone-500 text-xl">أشطر ستات بيوت بيطبخوا بحب</p>
            </div>
            <Link to="/chefs" className="text-brand-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
              عرض كل الطهاة <ArrowRight size={20} />
            </Link>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-8 no-scrollbar">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="min-w-[300px] bg-stone-50 rounded-[32px] overflow-hidden shadow-lg border border-stone-100"
              >
                <div className="h-48 relative">
                  <img src={CHEF_IMAGE_URL} className="w-full h-full object-cover" alt="Chef" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 right-4 text-white">
                    <h3 className="font-bold text-xl">شيف فاطمة</h3>
                    <p className="text-sm opacity-80">متخصصة في المحاشي</p>
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    <span className="font-bold text-stone-800">4.9</span>
                  </div>
                  <Link to="/chef/1" className="text-brand-primary font-bold text-sm">تصفح الاكلات</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Shef Style */}
      <section className="py-24 bg-brand-cream/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-brand-secondary mb-20">إزاي طبلية بتشتغل؟</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { step: "1", title: "اختار وجبتك", desc: "تصفح مئات الوجبات البيتي من طهاة قريبين منك.", icon: Utensils },
              { step: "2", title: "اطلب أسبوعك", desc: "حدد الوجبات اللي محتاجها للأسبوع كله في طلب واحد.", icon: Clock },
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

      {/* Bento Grid Categories */}
      <section className="py-20 bg-brand-peach/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="text-right">
              <span className="text-brand-primary font-black tracking-[0.3em] uppercase text-sm mb-4 block">لمحة من الاكلات</span>
              <h2 className="text-5xl md:text-[70px] font-black text-brand-secondary leading-[1] tracking-tighter">عندنا ايه <br /> النهاردة؟</h2>
            </div>
            <Link to="/meals" className="btn-secondary group">
              تصفح الاكلات 
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[320px]">
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

      {/* Why Tablia Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-secondary">ليه طبلية مش زي غيره؟</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { title: "طازة مش مجمد", desc: "كل أكلة بتتطبخ من الأول عشانك يوم بيوم.", icon: Utensils },
              { title: "أيادي ستات شاطرة", desc: "أختارنا الطباخات بعناية لضمان النفس الحلو.", icon: Award },
              { title: "نضافة مضمونة", desc: "بنفتش على كل مطبخ وبنتأكد من أعلى معايير النضافة.", icon: ShieldCheck },
              { title: "سعر على قد الإيد", desc: "أكلات بجودة عالية مقابل سعر يناسب ميزانيتك.", icon: Sparkles },
              { title: "توصيل سريع في طنطا", desc: "فريق توصيل مدرب بيوصلك الأكل سخن ومحفوظ صح.", icon: Clock }
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
            {[
              { id: 1, name: "صينية محشي مشكل", price: 180, img: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=800" },
              { id: 2, name: "فطير مشلتت بالسمن", price: 120, img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800" },
              { id: 3, name: "بط محمر بالمرتة", price: 450, img: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&q=80&w=800" },
              { id: 4, name: "مكرونة بالبشاميل", price: 150, img: "https://images.unsplash.com/photo-1614961909053-2e69107699e1?auto=format&fit=crop&q=80&w=800" }
            ].map((meal, i) => (
              <MealCard 
                key={meal.id}
                meal={{
                  id: meal.id,
                  title: meal.name,
                  price: meal.price,
                  image: meal.img,
                  chefId: "chef1",
                  chefName: "شيف طبلية",
                  rating: 4.9,
                  deliveryTime: 45
                }}
                index={i}
              />
            ))}
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
            <a href="https://wa.me/201234567890" target="_blank" rel="noopener noreferrer" className="bg-white text-brand-primary px-10 py-4 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-xl flex items-center gap-3">
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

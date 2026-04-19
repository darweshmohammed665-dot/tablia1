import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ShoppingBag, Clock, ArrowRight, MessageCircle, Utensils, Heart, Star, ShieldCheck, ChevronLeft, MapPin, Flame, Award, Sparkles, Dices } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ChefMap from '../components/ChefMap';
import { MealCard } from '../components/MealCard';
import { useRef, useEffect, useState } from 'react';
import { CHEF_IMAGE_URL } from '../constants';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const homeFoodImages = [
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1645696301019-35adcc18fc21?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600'
];

function FoodCarousel() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden aspect-square rounded-[40px] flex flex-col justify-center group"
    >
      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-scroll-left {
            animation: scroll-left 40s linear infinite;
          }
          .animate-scroll-right {
            animation: scroll-right 40s linear infinite;
          }
        `}
      </style>

      {/* Row 1 - scrolling left */}
      <div className="flex w-[200%] animate-scroll-left mb-6 md:mb-8">
        {[...homeFoodImages, ...homeFoodImages].map((img, i) => (
          <div key={`row1-${i}`} className="w-40 h-40 md:w-80 md:h-80 shrink-0 mx-3 md:mx-4 rounded-[2rem] overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
            <img src={img} className="w-full h-full object-cover" alt="أكل بيتي" referrerPolicy="no-referrer" />
          </div>
        ))}
      </div>

      {/* Row 2 - scrolling right */}
      <div className="flex w-[200%] animate-scroll-right">
        {[...homeFoodImages].reverse().concat([...homeFoodImages].reverse()).map((img, i) => (
          <div key={`row2-${i}`} className="w-40 h-40 md:w-80 md:h-80 shrink-0 mx-3 md:mx-4 rounded-[2rem] overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
            <img src={img} className="w-full h-full object-cover" alt="أكل بيتي" referrerPolicy="no-referrer" />
          </div>
        ))}
      </div>

      {/* Subtle fade edges to blend with white background naturally */}
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
    </motion.div>
  );
}

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
    <div ref={containerRef} className="relative min-h-screen overflow-hidden selection:bg-brand-primary selection:text-white bg-white">
      <div className="relative z-10 w-full">

      {/* Boxed Hero Section on White Background */}
      <div className="w-full bg-white pt-6 md:pt-10 pb-10">
        <div className="max-w-[1600px] mx-auto px-1 md:px-4">
          <section 
            className="relative w-full rounded-[32px] md:rounded-[48px] flex items-end justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-black ring-1 ring-black/5"
            style={{ 
              minHeight: "min(92vh, 900px)"
            }}
          >
            {/* Background Image Container with top-down feast image */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-95 transition-transform duration-1000 hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2560&auto=format&fit=crop')" }}
            ></div>

            {/* Premium Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 pointer-events-none z-0"></div>
            
            <div className="text-white p-6 md:p-14 text-center font-sans max-w-5xl w-full relative z-10 mb-4 md:mb-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-4 font-serif text-white drop-shadow-2xl"
          >
            تعبت من أكل الشارع؟
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-3xl mb-8 opacity-100 leading-relaxed font-medium drop-shadow-lg"
          >
            طبلية بيوصلك أكل بيت حقيقي، من مطبخ ست شاطرة، بأحسن جودة وأقل سعر ولحد باب بيتك في طنطا.
            <span className="text-lg md:text-xl text-brand-primary mt-4 block font-black drop-shadow-md">أول منصة في طنطا للأكل البيتي، مكونات مضمونة، ونضافة، وسعر على قد الإيد.</span>
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-10 text-sm md:text-lg font-bold"
          >
            <span className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-lg"><Sparkles size={20} className="text-brand-primary" /> طازج يومياً</span>
            <span className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-lg"><Heart size={20} className="text-brand-primary" /> مطبوخ بأيادي ستات بيوت</span>
            <span className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-lg"><ShieldCheck size={20} className="text-brand-primary" /> نضيف ومضمون</span>
            <span className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-lg"><Clock size={20} className="text-brand-primary" /> توصيل سريع</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="https://wa.me/201107507344" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-brand-primary text-white px-8 py-4 rounded-lg font-bold text-xl hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-3">
              <MessageCircle size={24} /> اطلب دلوقتي!
            </a>
            <Link to="/meals" className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-4 rounded-lg font-bold text-xl transition-all flex items-center justify-center gap-3">
              اختار أكلتك
            </Link>
          </motion.div>
        </div>
      </section>
        </div>
      </div>


      {/* Trending Luxury Ticker - Local Hero Design */}
      <div className="relative z-30 w-full bg-brand-secondary border-y border-white/10 shadow-xl py-3 md:py-4 overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(241,29,88,0.03)_0%,_transparent_70%)] pointer-events-none" />
        
        <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-default">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 md:gap-14 mx-5 md:mx-8">
              <div className="flex items-center gap-3">
                <div className="bg-brand-primary text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">جديد</div>
                <span className="text-white text-sm md:text-xl font-black tracking-tight select-none">أشهى أكل بيتي في طنطا 🍲</span>
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

      {/* Professional Bento Grid Categories Section - REMOVED AS REQUESTED BY USER */}

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
            
            {/* Auto Food Carousel */}
            <FoodCarousel />
          </div>
        </div>
      </section>

      {/* Meet the Chefs Section */}
      <section className="py-24 bg-stone-50 overflow-hidden">
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
            <div className="w-full py-12 text-center bg-white rounded-[32px] border border-dashed border-stone-200">
              <p className="text-stone-400 font-bold">جاري تجهيز قائمة بأفضل المطابخ...</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Shef Style */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-brand-secondary mb-20">إزاي طبلية بتشتغل؟</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { step: "1", title: "اختار وجبتك", desc: "تصفح أشهى الوجبات البيتي من مطابخ قريبة منك.", icon: Utensils },
              { step: "2", title: "اطلب", desc: "حدد الوجبات اللي محتاجها بسهولة في طلب واحد.", icon: Clock },
              { step: "3", title: "استمتع بالأكل", desc: "وجباتك هتوصلك طازجة، سخن واستمتع بطعم البيت.", icon: Heart }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="w-24 h-24 bg-stone-50 rounded-full shadow-xl flex items-center justify-center mx-auto mb-8 text-brand-primary">
                  <item.icon size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-brand-secondary">{item.title}</h3>
                <p className="text-stone-600 text-lg leading-relaxed">{item.desc}</p>
                {idx < 2 && (
                  <div className="hidden lg:block absolute top-12 -left-8 w-16 h-px bg-stone-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - User requested empty placeholder without images */}
      <section className="py-24 bg-white border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-secondary mb-16">بيقولوا إيه عن طبلية؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-8 bg-stone-50 rounded-3xl border border-stone-100">
                <div className="text-brand-primary mb-4 flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                </div>
                <p className="text-stone-600 italic font-medium leading-relaxed">
                  "سيتم إضافة تقييمات حقيقية من عملائنا قريباً. نحن نهتم برأيك وتجربتك مع طبلية."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Tablia Section */}
      <section className="py-24 bg-stone-50">
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
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                  <item.icon size={36} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-brand-secondary">{item.title}</h3>
                <p className="text-stone-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Meals - Shef Grid Style - REMOVED AS REQUESTED BY USER */}

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
              اطلب دلوقتي
            </a>
            <Link to="/meals" className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-black text-xl hover:bg-white hover:text-brand-primary transition-all">
              تصفح المنيو
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section - Shef Style */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-secondary mb-4">عندك استفسار؟</h2>
            <p className="text-stone-600 text-xl">كل اللي محتاج تعرفه عن طبلية</p>
          </div>

          <div className="space-y-6">
            {[
              { q: "إزاي بضمن إن الأكل نضيف؟", a: "كل شيف في طبلية بيعدي بمراحل تفتيش دقيقة على مطبخه، وبنتابع معاهم معايير النضافة العالمية بشكل دوري." },
              { q: "ممكن أطلب من أكتر من شيف في نفس المرة؟", a: "طبعاً! طبلية بتسمحلك تجمع وجباتك المفضلة من كذا شيف ويوصلولك كلهم في ميعاد واحد." },
              { q: "الأكل بيوصل سخن؟", a: "أكيد، فريق التوصيل بتاعنا بيستخدم شنط حرارية مخصوصة عشان الأكل يوصلك كأنه لسه طالع من الفرن." }
            ].map((faq, idx) => (
              <div key={idx} className="p-8 bg-stone-50 rounded-3xl border border-stone-100">
                <h3 className="text-xl font-bold text-brand-secondary mb-4">{faq.q}</h3>
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
    </div>
  );
}

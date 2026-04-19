import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Heart, ShieldCheck, Utensils, Users, MapPin, Star, Flame, Award, Sparkles, ChefHat, ShoppingBag, Coffee, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

const foodImages = [
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=800'
];

function ScrollingFood() {
  return (
    <div className="relative w-full overflow-hidden py-10 bg-white">
      <style>
        {`
          @keyframes scroll-x {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .animate-scroll-x {
            animation: scroll-x 40s linear infinite;
          }
          .animate-scroll-x-reverse {
            animation: scroll-x 40s linear infinite reverse;
          }
        `}
      </style>
      <div className="flex w-[200%] animate-scroll-x gap-4 px-4">
        {[...foodImages, ...foodImages].map((img, i) => (
          <div key={i} className="w-[300px] h-[400px] md:w-[400px] md:h-[500px] rounded-[32px] overflow-hidden shadow-2xl flex-shrink-0 group">
            <img 
              src={img} 
              alt="أكل بيتي" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </div>
      <div className="flex w-[200%] animate-scroll-x-reverse gap-4 px-4 mt-6">
        {[...foodImages].reverse().concat([...foodImages].reverse()).map((img, i) => (
          <div key={i} className="w-[300px] h-48 md:w-[500px] md:h-64 rounded-[32px] overflow-hidden shadow-xl flex-shrink-0 group">
            <img 
              src={img} 
              alt="أكل بيتي" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div ref={containerRef} className="bg-white min-h-screen selection:bg-brand-primary selection:text-white">
      
      {/* Dynamic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-secondary">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-accent/20 rounded-full blur-[120px] animation-delay-2000"></div>
          
          {/* Parallax Background Grid */}
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            style={{ y: heroY, opacity }}
            className="space-y-6"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 text-brand-primary text-sm font-black backdrop-blur-xl mb-4"
            >
              <Sparkles size={16} />
              منصة طبلية - طنطا
            </motion.span>
            
            <h1 className="text-6xl md:text-[140px] font-black text-white leading-[0.8] tracking-tighter">
              <span className="block opacity-80 scale-90 origin-right">نحن نعيد تعريف</span>
              <motion.span 
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="block text-brand-primary italic font-serif -skew-x-12 drop-shadow-[0_0_40px_rgba(255,165,0,0.4)]"
              >
                الطعم الأصلي
              </motion.span>
            </h1>
            
            <p className="text-xl md:text-3xl text-white/60 max-w-2xl mx-auto font-medium leading-tight pt-8">
              بدأنا في طنطا لنسهل وصول أكل البيت "النضيف" لكل واحد نفسه في غدوة تشرف وتفتح النفس.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
          < ChevronRight className="rotate-90" size={32} />
        </div>
      </section>

      {/* Modern Story Section */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="w-20 h-2 bg-brand-primary rounded-full"></div>
              <h2 className="text-5xl md:text-7xl font-black text-brand-secondary leading-[0.95]">
                من أيدي ماهره <br /> لـ طبلية بيتك.. <br /> بضغطة زر
              </h2>
              <div className="space-y-6 text-xl text-stone-500 font-medium leading-relaxed">
                <p>
                  طبلية مش مجرد وسيط، إحنا ضمان للجودة. في طنطا، وفي كل شارع فيها، فيه مطبخ "سري" ست بيت شاطرة جداً بتعمل عظمة، وإحنا مهمتنا نوصل العظمة دي ليك.
                </p>
                <p>
                  إحنا بنؤمن إن الأكل مش بس طاقة، الأكل ذكرى ومشاعر ونضيف جداً. عشان كدة كل شيف بينضم لينا بيعدي باختبارات "نفس" ونضافة صارمة.
                </p>
              </div>
              
              <div className="flex gap-4">
                <div className="flex -space-x-4 space-x-reverse">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-stone-200 overflow-hidden shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Chef${i}`} alt="شيف" />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-black text-stone-900 border-r-2 border-stone-100 pr-4">
                  <p className="text-brand-primary">طهاة محترفون</p>
                  <p className="opacity-50 uppercase tracking-wider">حول طنطا</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl rotate-2"
            >
              <img 
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-full object-cover" 
                alt="طهي منزلي" 
              />
              <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Moving Food Gallery */}
      <section className="py-20 bg-stone-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-20 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-brand-secondary mb-6">عيش التجربة بصرية</h2>
          <p className="text-stone-500 text-xl font-medium">كل دي وجبات بتطلع من مطابخنا يومياً</p>
        </div>
        <ScrollingFood />
      </section>

      {/* Values & Professionalism */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "الحب هو المكون الأساسي",
                desc: "الأكل البيتي بيتعمل بحب وإخلاص، وده اللي بيميزنا عن أي مطعم دليفري.",
                icon: Heart,
                color: "bg-red-50 text-red-500"
              },
              {
                title: "النضافة أولاً وأخيراً",
                desc: "كل مطبخ بيخضع لرقابة دورية ومعايير نضافة صارمة تليق بصحتك.",
                icon: ShieldCheck,
                color: "bg-green-50 text-green-500"
              },
              {
                title: "دعم الست المصرية",
                desc: "طبلية بتفتح باب رزق لمئات الستات الشاطرة والبيوت اللي بتقدم فن حقيقي.",
                icon: Award,
                color: "bg-blue-50 text-blue-500"
              }
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 rounded-[40px] border border-stone-100 bg-stone-50/50 hover:bg-white hover:shadow-2xl transition-all duration-500 group"
              >
                <div className={`w-16 h-16 ${v.color} rounded-x2l rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <v.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-brand-secondary mb-6">{v.title}</h3>
                <p className="text-lg text-stone-500 font-medium leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Elegant Closing CTA */}
      <section className="py-40 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-10">
          <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary shadow-inner">
            <ChefHat size={48} />
          </div>
          <h2 className="text-6xl md:text-[100px] font-black text-brand-secondary leading-none flex flex-col items-center">
            <motion.span 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: -15, opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl md:text-5xl opacity-40 mb-2"
            >
              كن جزءاً من
            </motion.span>
            <motion.span 
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 15, opacity: 1 }}
              viewport={{ once: true }}
              className="text-brand-primary italic font-serif"
            >
              عائلتنا
            </motion.span>
            <span className="mt-8 text-4xl md:text-6xl">اليوم</span>
          </h2>
          <p className="text-xl text-stone-500 font-medium max-w-2xl mx-auto">
            سواء كنت تريد تذوق الأفضل، أو تريد تحويل موهبتك في المطبخ لعمل ناجح.. طبلية هي وجهتك.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <Link to="/meals" className="btn-primary w-full sm:w-auto px-16 py-6 text-xl shadow-2xl hover:scale-105 transition-transform font-black">
              اكتشف الأكلات
            </Link>
            <Link to="/join-us" className="w-full sm:w-auto px-16 py-6 text-xl text-brand-secondary font-black hover:bg-stone-50 rounded-full transition-colors">
              انضم كشيف
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

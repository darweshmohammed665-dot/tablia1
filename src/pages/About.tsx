import { motion, useScroll, useTransform } from 'motion/react';
import { Heart, ShieldCheck, Utensils, Users, MapPin, Star, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CHEF_IMAGE_URL } from '../constants';

export default function About() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="bg-brand-cream min-h-screen relative">
      {/* Background Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.03] bg-grain"></div>
      
      {/* Hero Section - Editorial Style */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-brand-secondary">
        <motion.div 
          style={{ y }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1920" 
            alt="Professional Home Cooking Background" 
            className="w-full h-full object-cover opacity-70 scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-secondary/80 via-brand-secondary/40 to-brand-secondary"></div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-right mt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-6 py-2 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-brand-primary text-sm font-black tracking-[0.3em] uppercase mb-8 backdrop-blur-xl">
              إرث الطهي الأصيل يبدأ من طبلية
            </span>
            
            <h1 className="text-5xl md:text-[80px] font-black text-white mb-8 leading-[1] tracking-[-0.02em]">
              من نحن <br />
              <span className="text-brand-primary italic font-serif">طبلية طنطا</span>
            </h1>
            
            <p className="text-lg md:text-3xl text-white/70 max-w-3xl ml-auto font-medium leading-tight">
              أول منصة في طنطا للأكل البيتي، مكونات مضمونة، ونضافة، وسعر على قد الإيد.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-32 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl rotate-[-3deg] hover:rotate-0 transition-transform duration-1000">
                  <img 
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000" 
                    alt="Food Presentation" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-primary rounded-full flex items-center justify-center text-white p-8 text-center rotate-12 shadow-2xl">
                  <p className="font-black text-xl leading-tight">طعم ملوش زي في طنطا</p>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-7 text-right order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-[60px] md:text-[90px] font-black text-brand-secondary mb-10 leading-[0.9] tracking-tighter">
                  ليه <span className="text-brand-primary">طبلية</span> <br /> هي اللي كسبت؟
                </h2>
                <div className="space-y-8">
                  <p className="text-2xl text-stone-600 leading-relaxed font-medium">
                    في عصر الأكل السريع والديليفري اللي ملوش طعم، كان لازم حد يتدخل. طبلية مش مجرد أبلكيشن، دي حركة لترجيع "النفس" الحقيقي لموائدنا. إحنا هنا عشان نثبت إن أكل البيت هو اللي بيكسب دايماً.
                  </p>
                  <p className="text-2xl text-stone-600 leading-relaxed font-medium">
                    جمعنا أمهر طهاة طنطا في مكان واحد.. ستات البيوت اللي نفسهم "يوزن بلد" والناس اللي بتفهم في الأكل الصح. النتيجة؟ عظمة في كل طبق.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Standards Section */}
      <section className="py-[100px] bg-brand-peach/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[56px] font-bold text-brand-secondary mb-4">معايير الجودة بتاعتنا</h2>
            <p className="text-stone-500 text-xl">نحن نلتزم بأعلى المعايير لضمان تجربة طعام آمنة ومميزة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { title: "اختيار دقيق للطهاة", desc: "كل طباخة بتعدي على مقابلة شخصية ومراجعة نظافة مطبخها.", icon: Users },
              { title: "مكونات طازجة يومياً", desc: "المكونات بتتجاب طازجة كل يوم — مفيش مجمد أو قديم.", icon: Utensils },
              { title: "طهي عند الطلب", desc: "مفيش أكل جاهز — كل أكلة بتتطبخ بعد الطلب لضمان النفس.", icon: Flame },
              { title: "تغليف محكم ونظيف", desc: "التغليف نظيف ومحكم ومناسب للتوصيل لضمان الجودة.", icon: ShieldCheck },
              { title: "تقييم مستمر", desc: "تقييم مستمر من العملاء بعد كل طلب لضمان استمرار التميز.", icon: Star }
            ].map((item, i) => (
              <div key={i} className="food-card p-[20px] group text-center">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mx-auto mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-brand-secondary">{item.title}</h3>
                <p className="text-stone-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-[100px] bg-brand-secondary text-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">+50</p>
              <p className="text-brand-peach font-bold text-xl">شيف محترف</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">+1000</p>
              <p className="text-brand-peach font-bold text-xl">عميل مبسوط</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">+200</p>
              <p className="text-brand-peach font-bold text-xl">أكلة متنوعة</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">100%</p>
              <p className="text-brand-peach font-bold text-xl">طعم أصلي</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-[100px] bg-brand-cream">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-[56px] font-bold text-brand-secondary mb-8">جاهز تدوق <span className="text-brand-primary italic">العظمة</span>؟</h2>
          <p className="text-xl text-stone-500 mb-12">انضم لعيلة طبلية النهاردة.. سواء كنت شيف عاوز تفتح مطبخك أو أكيل بيدور على النفس الصح اللي بجد.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/meals" className="btn-primary py-5 px-12 text-xl shadow-2xl">دوق دلوقتي</Link>
            <Link to="/join-us" className="btn-secondary py-5 px-12 text-xl">انضم كطباخ</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { motion } from 'motion/react';
import { Heart, ShieldCheck, Utensils, Users, MapPin, Star } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Hero Section - Editorial Style */}
      <section className="relative h-[70vh] flex items-center overflow-hidden bg-stone-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=2070" 
            alt="Traditional Egyptian Kitchen" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-950/60 to-stone-950"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-right">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-end gap-3 mb-6"
          >
            <span className="text-brand-accent font-black tracking-widest uppercase text-sm">إرث الطهي الأصيل يبدأ من طبلية</span>
            <div className="h-[1px] w-12 bg-brand-accent"></div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-black text-white mb-8 leading-tight"
          >
            إحنا اللي <br />
            <span className="text-brand-primary italic">رجعنا النفس</span> للأكل
          </motion.h1>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-[100px] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-secondary/10 rounded-full blur-3xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000" 
                  alt="Food Presentation" 
                  className="relative z-10 rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            
            <div className="text-right order-1 lg:order-2">
              <h2 className="text-[56px] font-bold text-brand-accent mb-8">ليه <span className="text-brand-primary">طبلية</span> هي اللي كسبت؟</h2>
              <p className="text-xl text-stone-600 leading-relaxed mb-8">
                في عصر الأكل السريع والديليفري اللي ملوش طعم، كان لازم حد يتدخل. طبلية مش مجرد أبلكيشن، دي حركة لترجيع "النفس" الحقيقي لموائدنا. إحنا هنا عشان نثبت إن أكل البيت هو اللي بيكسب دايماً.
              </p>
              <p className="text-xl text-stone-600 leading-relaxed">
                جمعنا "حريفة" طنطا في مكان واحد.. ستات البيوت اللي نفسهم "يوزن بلد" والناس اللي بتفهم في الأكل الصح. النتيجة؟ عظمة في كل طبق.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Bento Grid */}
      <section className="py-[100px] bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[56px] font-bold text-brand-accent mb-4">ما الذي يميزنا؟</h2>
            <p className="text-stone-500 text-xl">قيمنا الجوهرية هي المحرك الأساسي لكل ما نقدمه</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="food-card p-[20px] group">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-brand-accent">شغف الطهي</h3>
              <p className="text-stone-500">كل طبق يخرج من مطابخنا هو نتاج شغف حقيقي، وليس مجرد طلب يتم تحضيره آلياً.</p>
            </div>

            <div className="food-card p-[20px] group">
              <div className="w-16 h-16 bg-brand-secondary/10 rounded-2xl flex items-center justify-center text-brand-secondary mb-6 group-hover:bg-brand-secondary group-hover:text-white transition-colors">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-brand-accent">جودة منزلية موثوقة</h3>
              <p className="text-stone-500">نلتزم بأعلى معايير النظافة والجودة، لنقدم لكم طعاماً يضاهي ما يُعد في منازلكم عنايةً وحرصاً.</p>
            </div>

            <div className="food-card p-[20px] group">
              <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent mb-6 group-hover:bg-brand-accent group-hover:text-white transition-colors">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-brand-accent">تمكين المجتمع المحلي</h3>
              <p className="text-stone-500">نفتح آفاقاً جديدة للطهاة الموهوبين في طنطا، لتمكينهم من مشاركة إبداعاتهم مع المجتمع.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-[100px] bg-brand-accent text-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">+50</p>
              <p className="text-brand-cream/80 font-bold text-xl">شيف حريفة</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">+1000</p>
              <p className="text-brand-cream/80 font-bold text-xl">عميل مبسوط</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">+200</p>
              <p className="text-brand-cream/80 font-bold text-xl">أكلة متنوعة</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">100%</p>
              <p className="text-brand-cream/80 font-bold text-xl">طعم أصلي</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-[100px] bg-brand-cream">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-[56px] font-bold text-brand-accent mb-8">جاهز تدوق <span className="text-brand-primary italic">العظمة</span>؟</h2>
          <p className="text-xl text-stone-500 mb-12">انضم لعيلة طبلية النهاردة.. سواء كنت حريف عاوز تفتح مطبخك أو أكيل بيدور على النفس الصح اللي بجد.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/meals" className="btn-primary py-5 px-12 text-xl shadow-2xl">دوق دلوقتي</Link>
            <Link to="/register?role=chef" className="btn-secondary py-5 px-12 text-xl">انضم للحريفة</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Utensils, Users, MapPin, Star } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white min-h-screen">
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
            <span className="text-brand-accent font-black tracking-widest uppercase text-sm">حكايتنا بدأت من الطبلية</span>
            <div className="h-[1px] w-12 bg-brand-accent"></div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-black text-white mb-8 leading-tight"
          >
            إحنا مين؟ <br />
            <span className="text-brand-primary italic">طبلية</span> مش مجرد أبلكيشن
          </motion.h1>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-24 relative overflow-hidden">
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
              <h2 className="text-4xl font-black text-stone-900 mb-8">ليه عملنا <span className="text-brand-primary">طبلية</span>؟</h2>
              <p className="text-xl text-stone-600 leading-relaxed mb-8">
                في زحمة الحياة والأكل السريع، نسينا طعم "النفس" الحقيقي.. طعم أكل ست الكل اللي بيتعمل بحب وصبر. طبلية اتولدت في قلب طنطا عشان ترجعنا للأصل.
              </p>
              <p className="text-xl text-stone-600 leading-relaxed">
                إحنا منصة بتجمع "حريفة" طنطا - ستات البيوت الشاطرين اللي نفسهم ملوش زي - بالناس اللي بتدور على لقمة هنية، نظيفة، وطعمها بيعدل المزاج.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Bento Grid */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-stone-900 mb-4">إيه اللي بيميزنا؟</h2>
            <p className="text-stone-500 text-lg">قيمنا هي اللي بتخلي كل أكلة من طبلية حكاية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">النفس هو السر</h3>
              <p className="text-stone-500">كل أكلة بتطلع من مطبخ طبلية معمولة بحب وشغف، مش مجرد طلب بيتحضر.</p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-brand-secondary/10 rounded-2xl flex items-center justify-center text-brand-secondary mb-6 group-hover:bg-brand-secondary group-hover:text-white transition-colors">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">نظافة ست البيت</h3>
              <p className="text-stone-500">بنطبق أعلى معايير النظافة والجودة، كأنك بتاكل من إيد والدتك بالظبط.</p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent mb-6 group-hover:bg-brand-accent group-hover:text-stone-900 transition-colors">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">دعم الحريفة</h3>
              <p className="text-stone-500">بنفتح باب رزق لكل ست بيت شاطرة في طنطا عشان توصل موهبتها لكل بيت.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-5xl font-black mb-2">+50</p>
              <p className="text-white/70 font-bold">شيف حريفة</p>
            </div>
            <div>
              <p className="text-5xl font-black mb-2">+1000</p>
              <p className="text-white/70 font-bold">عميل مبسوط</p>
            </div>
            <div>
              <p className="text-5xl font-black mb-2">+200</p>
              <p className="text-white/70 font-bold">أكلة متنوعة</p>
            </div>
            <div>
              <p className="text-5xl font-black mb-2">100%</p>
              <p className="text-white/70 font-bold">طعم أصلي</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-stone-900 mb-8">جاهز تدوق <span className="text-brand-primary italic">الفرق</span>؟</h2>
          <p className="text-xl text-stone-500 mb-12">انضم لعيلة طبلية النهاردة، سواء كنت حريف عاوز تفتح مطبخك أو أكيل بيدور على النفس الصح.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/meals" className="btn-primary py-5 px-12 text-xl shadow-2xl">اطلب دلوقتي</Link>
            <Link to="/register?role=chef" className="btn-secondary py-5 px-12 text-xl">افتح مطبخك</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';

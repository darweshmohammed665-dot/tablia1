import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Utensils, Clock, MessageCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function JoinUs() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: '',
    specialties: '',
    hours: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('تم إرسال طلبك بنجاح! سنتواصل معكِ خلال 48 ساعة.');
    setFormData({ name: '', phone: '', area: '', specialties: '', hours: '' });
  };

  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-brand-secondary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=2000" 
            alt="Chef Cooking" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-right">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight">
              مطبخك = <span className="text-brand-primary">رأس مالك</span>
            </h1>
            <p className="text-xl md:text-3xl text-white/80 max-w-3xl ml-auto font-medium">
              لو عندك موهبة في الطبخ ونفسك حلو في الأكل — طبلية عايزاكِ. مش محتاجة محل. مش محتاجة رأس مال. مطبخ بيتك هو مشروعك.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-brand-secondary mb-4">مزايا الانضمام لطبلية</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { icon: Heart, title: "دخل إضافي من بيتك", desc: "استغلي موهبتك في زيادة دخلك" },
              { icon: Clock, title: "أنتِ اللي بتحددي مواعيدك", desc: "حرية كاملة في اختيار أوقات العمل" },
              { icon: Utensils, title: "إحنا بنتعامل مع التوصيل", desc: "ركزي في الطبخ وسيبيلنا التوصيل" },
              { icon: ShieldCheck, title: "تدريب مجاني", desc: "تدريب على التغليف ومعايير الجودة" },
              { icon: MessageCircle, title: "دعم تسويقي", desc: "هنوصل أكلك لآلاف العملاء في طنطا" }
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-xl text-center group hover:bg-brand-primary hover:text-white transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-6 text-brand-primary group-hover:text-white transition-colors">
                  <benefit.icon size={64} strokeWidth={1} />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-stone-500 group-hover:text-white/80 text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who can join & Steps */}
      <section className="py-24 bg-brand-peach/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="text-right">
              <h2 className="text-4xl font-black text-brand-secondary mb-8">مين تقدر تنضم لطبلية؟</h2>
              <ul className="space-y-6">
                {[
                  "ست بيت شاطرة ونفسها حلو في الأكل المصري",
                  "مطبخها نظيف ومرتب",
                  "قادرة تلتزم بمواعيد التسليم",
                  "عندها موبايل وواتساب",
                  "مش مشروط إنك تطبخي كل يوم — ممكن تبدأي بأيام معينة في الأسبوع"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-xl text-stone-700 font-medium">
                    <CheckCircle2 className="text-brand-primary shrink-0" size={28} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-black text-brand-secondary mb-8">إزاي تنضمي؟</h2>
              <div className="space-y-8">
                {[
                  { step: "1", text: "املي الفورم ده بمعلوماتك" },
                  { step: "2", text: "هيتواصل معاكِ الفريق خلال 48 ساعة" },
                  { step: "3", text: "اختبار للتأكد من جودة مطبخك" },
                  { step: "4", text: "أول طلب وابدأي اعملي دخل من بيتك" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-md">
                    <span className="text-4xl font-black text-brand-primary">{item.step}</span>
                    <p className="text-xl font-bold text-stone-800">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-stone-100">
            <div className="bg-brand-primary p-10 text-white text-center">
              <h2 className="text-4xl font-black mb-2">فورم التسجيل</h2>
              <p className="text-white/80 font-medium">ابدأي رحلتك معانا النهاردة</p>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8 text-right">
              <div>
                <label className="block text-stone-700 font-bold mb-3 text-xl">الاسم</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-brand-cream/50 border-2 border-transparent focus:border-brand-primary outline-none transition-all text-xl"
                  placeholder="اسمك بالكامل"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-3 text-xl">رقم الهاتف / واتساب</label>
                <input 
                  type="tel" 
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-brand-cream/50 border-2 border-transparent focus:border-brand-primary outline-none transition-all text-xl"
                  placeholder="01xxxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-3 text-xl">المنطقة في طنطا</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-brand-cream/50 border-2 border-transparent focus:border-brand-primary outline-none transition-all text-xl"
                  placeholder="مثلاً: سيجر، المحطة، الاستاد..."
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-3 text-xl">أكلاتك المميزة</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-6 py-4 rounded-2xl bg-brand-cream/50 border-2 border-transparent focus:border-brand-primary outline-none transition-all text-xl"
                  placeholder="اكتبي أكتر أكلات بتعمليها حلو..."
                  value={formData.specialties}
                  onChange={(e) => setFormData({...formData, specialties: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-3 text-xl">أيام / ساعات الشغل المفضلة</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-brand-cream/50 border-2 border-transparent focus:border-brand-primary outline-none transition-all text-xl"
                  placeholder="مثلاً: كل يوم، أو أيام معينة..."
                  value={formData.hours}
                  onChange={(e) => setFormData({...formData, hours: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-brand-primary text-white py-6 rounded-2xl font-black text-2xl hover:scale-[1.02] transition-transform shadow-xl shadow-brand-primary/30 flex items-center justify-center gap-4"
              >
                ابعتي طلبك دلوقتي — وابدأي اكسبي من مطبخك
                <ArrowRight size={28} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

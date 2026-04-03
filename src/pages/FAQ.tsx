import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "كيف تعمل طبلية؟",
    answer: "طبلية هي منصة تربطك بأفضل الطهاة المنزليين في طنطا. يمكنك تصفح قوائم الطعام، اختيار وجباتك المفضلة، وتحديد موعد التوصيل. يقوم طهاتنا بإعداد الطعام طازجاً وبكل حب ليصلك حتى باب منزلك."
  },
  {
    question: "متى سيصل طعامي؟",
    answer: "نحن نوفر خيارات توصيل مرنة. يمكنك اختيار التوصيل الفوري للوجبات المتاحة، أو الجدولة المسبقة لوجبات الأسبوع. ستتلقى إشعارات بتحديثات حالة طلبك وتتبع السائق مباشرة."
  },
  {
    question: "من هم الطهاة؟",
    answer: "طهاة طبلية هم 'حريفة' طنطا الموهوبين. نقوم بالتحقق من خلفياتهم، مهاراتهم في الطبخ، ومعايير النظافة في مطابخهم لضمان حصولك على أفضل تجربة طعام منزلي."
  },
  {
    question: "هل يمكنني التخطي أو الإلغاء؟",
    answer: "نعم، يمكنك إلغاء طلبك أو تعديله قبل بدء الشيف في تحضيره. بالنسبة لخطط التوصيل الأسبوعي، يمكنك تخطي أي أسبوع بسهولة من خلال إعدادات حسابك."
  },
  {
    question: "هل يمكنني الطلب من أكثر من طباخ؟",
    answer: "بالتأكيد! يمكنك مزج وتنسيق وجبات من طهاة مختلفين في طلب واحد لتستمتع بتنوع النكهات والأطباق."
  },
  {
    question: "هل الوجبات جاهزة تماماً؟",
    answer: "نعم، جميع الوجبات تصلك مطبوخة وجاهزة تماماً. بعض الوجبات قد تحتاج فقط إلى تسخين بسيط لتستمتع بها كأنها خرجت للتو من الفرن."
  },
  {
    question: "ماذا عن الحقائب وعبوات الثلج؟",
    answer: "نستخدم حقائب حرارية مخصصة وعبوات ثلج للحفاظ على طزاجة الطعام ودرجة حرارته المثالية أثناء عملية التوصيل."
  },
  {
    question: "هل يمكنني التحدث مع الطباخ الخاص بي؟",
    answer: "نعم، يمكنك التواصل مع الشيف مباشرة من خلال نظام الدردشة المدمج في التطبيق لأي استفسارات خاصة بطلبك أو تفضيلاتك الغذائية."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="bg-brand-cream min-h-screen py-[120px]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-brand-accent mb-6">الأسئلة الشائعة</h1>
          <p className="text-stone-500 text-xl">كل اللي محتاج تعرفه عن طبلية في مكان واحد.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden"
            >
              <button 
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-right hover:bg-stone-50 transition-colors"
              >
                <span className="text-xl font-bold text-brand-accent">{faq.question}</span>
                <ChevronDown 
                  className={`text-brand-primary transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`} 
                  size={24} 
                />
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-8 text-stone-600 leading-relaxed text-lg border-t border-stone-50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center bg-white rounded-[3rem] p-12 shadow-xl border border-stone-100">
          <h3 className="text-2xl font-black text-brand-accent mb-4 uppercase">لسه عندك أسئلة؟</h3>
          <p className="text-stone-500 mb-8 text-lg">فريق الدعم بتاعنا جاهز يساعدك في أي وقت.</p>
          <button className="inline-flex items-center gap-3 bg-white border-2 border-stone-100 text-brand-accent px-10 py-4 rounded-full font-bold hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm">
            <MessageCircle size={24} />
            تواصل معنا الآن
          </button>
        </div>

        <div className="mt-16 text-center">
          <Link to="/meals" className="inline-flex items-center gap-2 text-brand-primary font-black text-xl hover:gap-4 transition-all">
            ابدأ طلبك الأول دلوقتي <ArrowRight size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
}

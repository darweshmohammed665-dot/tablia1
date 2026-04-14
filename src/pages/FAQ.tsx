import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "كيف تعمل منصة طبلية؟",
    answer: "طبلية هي منصة رائدة تربطكم بنخبة من أمهر المطابخ المنزلية في طنطا. يمكنك تصفح قوائم الطعام المتنوعة، اختيار وجباتك المفضلة، وتحديد موعد التوصيل المناسب. تقوم مطابخنا بإعداد الطعام طازجاً وفق أعلى معايير الجودة ليصلكم حتى باب منزلكم."
  },
  {
    question: "ما هي المواعيد المتوقعة لتوصيل الطلبات؟",
    answer: "نحن نوفر خيارات توصيل مرنة تلبي احتياجاتكم؛ حيث يمكنك اختيار التوصيل الفوري للوجبات المتاحة، أو جدولة وجباتكم للأسبوع بالكامل مسبقاً. ستتلقون إشعارات لحظية بتحديثات حالة الطلب مع إمكانية تتبع السائق مباشرة."
  },
  {
    question: "كيف يتم اختيار وتأهيل المطابخ؟",
    answer: "مطابخ طبلية هي المبدعة في فنون الطهي المنزلي بطنطا. نحن نطبق معايير اختيار صارمة تشمل التحقق من الخلفية المهنية، مهارات الطهي، والالتزام التام بمعايير النظافة والسلامة الغذائية في مطابخهم."
  },
  {
    question: "هل يمكنني تعديل أو إلغاء الطلب؟",
    answer: "نعم، تتيح المنصة إمكانية تعديل أو إلغاء الطلب قبل بدء المطبخ في عملية التحضير. وبالنسبة لخطط التوصيل الأسبوعي، يمكنك إدارة اشتراكك وتخطي أي أسبوع بسهولة من خلال إعدادات حسابك."
  },
  {
    question: "هل يمكنني الطلب من مطابخ متعددة في آن واحد؟",
    answer: "بالتأكيد، تمنحكم طبلية حرية اختيار وتنسيق وجبات من مطابخ مختلفة ضمن طلب واحد، لتستمتعوا بتنوع النكهات والأطباق في تجربة فريدة."
  },
  {
    question: "هل تصل الوجبات جاهزة للتناول مباشرة؟",
    answer: "نعم، جميع الوجبات تصلكم مطبوخة وجاهزة تماماً. قد تتطلب بعض الأطباق تسخيناً بسيطاً لضمان الاستمتاع بالمذاق الطازج وكأنها خرجت للتو من الفرن."
  },
  {
    question: "كيف يتم ضمان جودة وحرارة الطعام أثناء التوصيل؟",
    answer: "نعتمد في طبلية على حقائب حرارية متطورة وعبوات تبريد مخصصة للحفاظ على طزاجة المكونات ودرجة الحرارة المثالية للطعام طوال رحلة التوصيل."
  },
  {
    question: "هل تتوفر ميزة التواصل المباشر مع المطبخ؟",
    answer: "نعم، توفر المنصة نظام دردشة آمن يتيح لكم التواصل المباشر مع المطبخ لمناقشة أي تفاصيل خاصة بطلبكم أو تفضيلاتكم الغذائية الخاصة."
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

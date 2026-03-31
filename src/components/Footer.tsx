import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Heart, Utensils } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400 pt-32 pb-12 relative overflow-hidden text-right">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-30"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
                <Utensils size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white tracking-tighter leading-none font-serif">طبلية</span>
                <span className="text-[10px] font-bold text-brand-primary tracking-[0.2em] uppercase">Authentic Cuisine</span>
              </div>
            </Link>
            <p className="text-xl text-stone-500 leading-relaxed max-w-md mb-10">
              نحن نعيد تعريف مفهوم الأكل البيتي في مصر. نجمع بين أصالة الطعم ورفاهية التجربة الأصيلة.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-300 border border-white/10">
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest">المنصة</h4>
            <ul className="space-y-5">
              <li><Link to="/" className="hover:text-brand-accent transition-colors font-bold">الرئيسية</Link></li>
              <li><Link to="/meals" className="hover:text-brand-accent transition-colors font-bold">تصفح الأكلات</Link></li>
              <li><Link to="/chefs" className="hover:text-brand-accent transition-colors font-bold">سوق الطهاة</Link></li>
              <li><Link to="/register?role=chef" className="hover:text-brand-accent transition-colors font-bold">انضم كطباخ</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest">المساعدة</h4>
            <ul className="space-y-5">
              <li><Link to="/faq" className="hover:text-brand-accent transition-colors font-bold">الأسئلة الشائعة</Link></li>
              <li><Link to="/contact" className="hover:text-brand-accent transition-colors font-bold">اتصل بنا</Link></li>
              <li><Link to="/terms" className="hover:text-brand-accent transition-colors font-bold">الشروط</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-accent transition-colors font-bold">الخصوصية</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest">النشرة الإخبارية</h4>
            <p className="text-stone-500 mb-6 font-bold">اشترك لتعرف أحدث العروض والخصومات الحصرية.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-primary transition-colors text-white font-bold"
              />
              <button className="absolute left-2 top-2 bottom-2 bg-brand-primary text-white px-6 rounded-xl font-bold hover:bg-brand-primary/80 transition-colors">
                إرسال
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm font-bold text-stone-600">
            © {new Date().getFullYear()} طبلية طنطا. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-8">
            <p className="text-sm font-bold text-stone-600 flex items-center gap-2">
              صُنع بكل <Heart size={16} className="text-brand-primary fill-brand-primary" /> في طنطا - مصر
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-5 bg-white/10 rounded-sm"></div>
              <div className="w-8 h-5 bg-white/10 rounded-sm"></div>
              <div className="w-8 h-5 bg-white/10 rounded-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

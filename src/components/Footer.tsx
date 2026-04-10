import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Heart, Utensils, Phone as WhatsApp } from 'lucide-react';

const TikTokIcon = ({ size = 24 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    <path d="M13 4a4 4 0 0 0 4 4" />
  </svg>
);

export default function Footer() {
  const socialLinks = [
    { Icon: Facebook, href: "https://www.facebook.com/share/18XobVq5sr/" },
    { Icon: Instagram, href: "https://www.instagram.com/tablia_official?utm_source=qr&igsh=d3V1bjlzZzA5bXZ5" },
    { Icon: TikTokIcon, href: "https://www.tiktok.com/@tablia_official?_r=1&_t=ZS-959vIXdCNuu" },
    { Icon: WhatsApp, href: "https://wa.me/201000000000" }, // Placeholder WhatsApp
    { Icon: Youtube, href: "https://youtube.com/@tablia-official?si=7L6cxyaxz5gYyP3I" },
  ];

  return (
    <footer className="bg-brand-secondary text-brand-cream pt-24 pb-12 relative overflow-hidden text-right">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center mb-8 group">
              <div className="w-[110px] h-[60px] flex items-center justify-center group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                <img 
                  src="https://i.ibb.co/B2Fm90cV/Whats-Ap-Image-2026-04-02-at-13-09-41-1.jpg" 
                  alt="طبلية" 
                  className="w-full h-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </Link>
            <p className="text-xl text-brand-cream/70 leading-relaxed max-w-md mb-10 font-medium">
              طنطا كلها بتطلب من طبلية.. دوقي النفس الفلاحي اللي بيعدل المزاج وبيخلص الكلام. اطلبي دلوقتي قبل ما الكمية تخلص!
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-300 border border-white/5 shadow-lg"
                >
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-brand-primary font-bold text-xs mb-8 uppercase tracking-widest">المنصة</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-brand-cream/60 hover:text-brand-primary transition-colors font-bold text-base">الرئيسية</Link></li>
              <li><Link to="/about" className="text-brand-cream/60 hover:text-brand-primary transition-colors font-bold text-base">من نحن</Link></li>
              <li><Link to="/meals" className="text-brand-cream/60 hover:text-brand-primary transition-colors font-bold text-base">تصفح الأكلات</Link></li>
              <li><Link to="/chefs" className="text-brand-cream/60 hover:text-brand-primary transition-colors font-bold text-base">سوق الطهاة</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-brand-primary font-bold text-xs mb-8 uppercase tracking-widest">المساعدة</h4>
            <ul className="space-y-4">
              <li><Link to="/faq" className="text-brand-cream/60 hover:text-brand-primary transition-colors font-bold text-base">الأسئلة الشائعة</Link></li>
              <li><Link to="/contact" className="text-brand-cream/60 hover:text-brand-primary transition-colors font-bold text-base">اتصل بنا</Link></li>
              <li><Link to="/terms" className="text-brand-cream/60 hover:text-brand-primary transition-colors font-bold text-base">الشروط</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-brand-primary font-bold text-xs mb-8 uppercase tracking-widest">النشرة الإخبارية</h4>
            <p className="text-brand-cream/70 mb-6 font-bold text-base">اشترك لتعرف أحدث العروض والخصومات الحصرية.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-brand-primary transition-all text-white font-bold text-base"
              />
              <button className="absolute left-2 top-2 bottom-2 bg-brand-primary text-white px-6 rounded-lg font-bold hover:bg-brand-primary/90 transition-all shadow-md">
                إرسال
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-xs font-bold text-brand-cream/40 tracking-widest">
            © {new Date().getFullYear()} طبلية طنطا. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-8">
            <p className="text-xs font-bold text-brand-cream/40 flex items-center gap-2 tracking-widest">
              صُنع بكل <Heart size={14} className="text-brand-primary fill-brand-primary" /> في طنطا - مصر
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

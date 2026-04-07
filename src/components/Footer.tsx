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
    { Icon: Twitter, href: "#" },
    { Icon: Youtube, href: "https://youtube.com/@tablia-official?si=7L6cxyaxz5gYyP3I" },
  ];

  return (
    <footer className="bg-brand-secondary text-brand-cream pt-16 md:pt-32 pb-12 relative overflow-hidden text-right">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-30"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center mb-8 group">
              <div className="w-[50px] h-[40px] flex items-center justify-center group-hover:scale-105 transition-transform duration-500 overflow-hidden mix-blend-screen invert grayscale brightness-[2] contrast-[1.5]">
                <img 
                  src="https://i.ibb.co/B2Fm90cV/Whats-Ap-Image-2026-04-02-at-13-09-41-1.jpg" 
                  alt="طبلية" 
                  className="w-full h-auto object-contain scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
            </Link>
            <p className="text-xl text-brand-cream/80 leading-relaxed max-w-md mb-10">
              طنطا كلها بتطلب من طبلية.. دوقي النفس الفلاحي اللي بيعدل المزاج وبيخلص الكلام. اطلبي دلوقتي قبل ما الكمية تخلص!
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-300 border border-white/10"
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-brand-cream font-black text-lg mb-8 uppercase tracking-widest">المنصة</h4>
            <ul className="space-y-5">
              <li><Link to="/" className="hover:text-brand-primary transition-colors font-bold">الرئيسية</Link></li>
              <li><Link to="/about" className="hover:text-brand-primary transition-colors font-bold">من نحن</Link></li>
              <li><Link to="/meals" className="hover:text-brand-primary transition-colors font-bold">تصفح الأكلات</Link></li>
              <li><Link to="/chefs" className="hover:text-brand-primary transition-colors font-bold">سوق الطهاة</Link></li>
              <li><Link to="/register?role=chef" className="hover:text-brand-primary transition-colors font-bold">انضم كطباخ</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-brand-cream font-black text-lg mb-8 uppercase tracking-widest">المساعدة</h4>
            <ul className="space-y-5">
              <li><Link to="/faq" className="hover:text-brand-primary transition-colors font-bold">الأسئلة الشائعة</Link></li>
              <li><Link to="/contact" className="hover:text-brand-primary transition-colors font-bold">اتصل بنا</Link></li>
              <li><Link to="/terms" className="hover:text-brand-primary transition-colors font-bold">الشروط</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-primary transition-colors font-bold">الخصوصية</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-brand-cream font-black text-lg mb-8 uppercase tracking-widest">النشرة الإخبارية</h4>
            <p className="text-brand-cream/80 mb-6 font-bold">اشترك لتعرف أحدث العروض والخصومات الحصرية.</p>
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
          <p className="text-sm font-bold text-brand-cream/60">
            © {new Date().getFullYear()} طبلية طنطا. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-8">
            <p className="text-sm font-bold text-brand-cream/60 flex items-center gap-2">
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

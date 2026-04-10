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
    <footer className="bg-brand-secondary text-brand-cream pt-24 md:pt-40 pb-12 relative overflow-hidden text-right">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-30"></div>
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px]"></div>
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-32">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center mb-10 group">
              <div className="w-[70px] h-[56px] flex items-center justify-center group-hover:scale-110 transition-transform duration-700 overflow-hidden mix-blend-screen invert grayscale brightness-[2] contrast-[1.5]">
                <img 
                  src="https://i.ibb.co/B2Fm90cV/Whats-Ap-Image-2026-04-02-at-13-09-41-1.jpg" 
                  alt="طبلية" 
                  className="w-full h-auto object-contain scale-125"
                  referrerPolicy="no-referrer"
                />
              </div>
            </Link>
            <p className="text-2xl text-brand-cream/70 leading-relaxed max-w-md mb-12 font-medium">
              طنطا كلها بتطلب من طبلية.. دوقي النفس الفلاحي اللي بيعدل المزاج وبيخلص الكلام. اطلبي دلوقتي قبل ما الكمية تخلص!
            </p>
            <div className="flex gap-5">
              {socialLinks.map(({ Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-500 border border-white/10 shadow-xl"
                >
                  <Icon size={28} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-brand-primary font-black text-sm mb-10 uppercase tracking-[0.3em]">المنصة</h4>
            <ul className="space-y-6">
              <li><Link to="/" className="text-brand-cream/60 hover:text-brand-primary transition-colors font-black text-lg">الرئيسية</Link></li>
              <li><Link to="/about" className="text-brand-cream/60 hover:text-brand-primary transition-colors font-black text-lg">من نحن</Link></li>
              <li><Link to="/meals" className="text-brand-cream/60 hover:text-brand-primary transition-colors font-black text-lg">تصفح الأكلات</Link></li>
              <li><Link to="/chefs" className="text-brand-cream/60 hover:text-brand-primary transition-colors font-black text-lg">سوق الطهاة</Link></li>
              <li><Link to="/register?role=chef" className="text-brand-cream/60 hover:text-brand-primary transition-colors font-black text-lg">انضم كطباخ</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-brand-primary font-black text-sm mb-10 uppercase tracking-[0.3em]">المساعدة</h4>
            <ul className="space-y-6">
              <li><Link to="/faq" className="text-brand-cream/60 hover:text-brand-primary transition-colors font-black text-lg">الأسئلة الشائعة</Link></li>
              <li><Link to="/contact" className="text-brand-cream/60 hover:text-brand-primary transition-colors font-black text-lg">اتصل بنا</Link></li>
              <li><Link to="/terms" className="text-brand-cream/60 hover:text-brand-primary transition-colors font-black text-lg">الشروط</Link></li>
              <li><Link to="/privacy" className="text-brand-cream/60 hover:text-brand-primary transition-colors font-black text-lg">الخصوصية</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-brand-primary font-black text-sm mb-10 uppercase tracking-[0.3em]">النشرة الإخبارية</h4>
            <p className="text-brand-cream/70 mb-8 font-black text-lg">اشترك لتعرف أحدث العروض والخصومات الحصرية.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="w-full bg-white/5 border border-white/10 rounded-[24px] py-6 px-8 focus:outline-none focus:border-brand-primary transition-all text-white font-black text-lg"
              />
              <button className="absolute left-3 top-3 bottom-3 bg-brand-primary text-white px-8 rounded-[18px] font-black hover:bg-brand-primary/80 transition-all shadow-lg shadow-brand-primary/30">
                إرسال
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-sm font-black text-brand-cream/40 tracking-widest">
            © {new Date().getFullYear()} طبلية طنطا. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-10">
            <p className="text-sm font-black text-brand-cream/40 flex items-center gap-3 tracking-widest">
              صُنع بكل <Heart size={18} className="text-brand-primary fill-brand-primary" /> في طنطا - مصر
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

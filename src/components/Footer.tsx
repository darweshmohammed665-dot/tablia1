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
    { Icon: WhatsApp, href: "https://wa.me/201107507344" }, // Updated WhatsApp
    { Icon: Youtube, href: "https://youtube.com/@tablia-official?si=7L6cxyaxz5gYyP3I" },
  ];

  return (
    <footer className="bg-white text-stone-900 pt-24 pb-12 border-t border-stone-100 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src="https://i.ibb.co/3y9wLQc5/1775915563891.png" alt="طبلية" className="h-12 w-auto" referrerPolicy="no-referrer" />
            </Link>
            <p className="text-stone-500 leading-relaxed font-medium">
              أكل بيتي حقيقي من مطابخ ستات بيوت طنطا، بيوصلك لحد بابك بكل حب ونضافة.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-6">المنصة</h4>
            <ul className="space-y-4">
              <li><Link to="/meals" className="text-stone-500 hover:text-brand-primary transition-colors">تصفح الأكلات</Link></li>
              <li><Link to="/chefs" className="text-stone-500 hover:text-brand-primary transition-colors">قابل المطابخ</Link></li>
              <li><Link to="/about" className="text-stone-500 hover:text-brand-primary transition-colors">كيف يعمل؟</Link></li>
              <li><Link to="/join-us" className="text-stone-500 hover:text-brand-primary transition-colors">انضم كشيف</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-6">الدعم</h4>
            <ul className="space-y-4">
              <li><Link to="/faq" className="text-stone-500 hover:text-brand-primary transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link to="/contact" className="text-stone-500 hover:text-brand-primary transition-colors">اتصل بنا</Link></li>
              <li><Link to="/terms" className="text-stone-500 hover:text-brand-primary transition-colors">الشروط والأحكام</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-6">تابعنا</h4>
            <div className="flex gap-4">
              {socialLinks.map(({ Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-brand-primary hover:text-white transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-400">
            © {new Date().getFullYear()} طبلية طنطا. جميع الحقوق محفوظة.
          </p>
          <p className="text-sm text-stone-400 flex items-center gap-1">
            صُنع بكل <Heart size={14} className="text-brand-primary fill-brand-primary" /> في طنطا
          </p>
        </div>
      </div>
    </footer>
  );
}

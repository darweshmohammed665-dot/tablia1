import { Link, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { ShoppingCart, User as UserIcon, LogOut, Menu, X, Utensils } from 'lucide-react';
import { useState } from 'react';
import { auth } from '../firebase';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  user: User | null;
  profile: UserProfile | null;
}

export default function Navbar({ user, profile }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-brand-cream/90 backdrop-blur-xl sticky top-0 z-50 border-b border-stone-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ 
                scale: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                hover: {
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }
              }}
              className="w-[50px] h-[40px] flex items-center justify-center overflow-hidden mix-blend-multiply contrast-[1.1]"
            >
              <img 
                src="https://i.ibb.co/B2Fm90cV/Whats-Ap-Image-2026-04-02-at-13-09-41-1.jpg" 
                alt="طبلية" 
                className="w-full h-auto object-contain scale-125"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              <Link to="/" className="relative text-stone-600 hover:text-brand-primary transition-colors font-bold text-sm uppercase tracking-wider group">
                الرئيسية
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/meals" className="relative text-stone-600 hover:text-brand-primary transition-colors font-bold text-sm uppercase tracking-wider group">
                الأكلات
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/chefs" className="relative text-stone-600 hover:text-brand-primary transition-colors font-bold text-sm uppercase tracking-wider group">
                الطهاة
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/about" className="relative text-stone-600 hover:text-brand-primary transition-colors font-bold text-sm uppercase tracking-wider group">
                من نحن
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            
            <div className="flex items-center gap-6 mr-6 border-r border-stone-200 pr-6">
              <Link to="/cart" className="p-3 text-stone-600 hover:text-brand-primary relative bg-stone-50 rounded-2xl transition-colors">
                <ShoppingCart size={22} />
                <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md">0</span>
              </Link>

              {user ? (
                <div className="flex items-center gap-4">
                  {profile?.role === 'chef' && (
                    <Link to="/dashboard" className="bg-brand-secondary/10 text-brand-secondary px-4 py-2 rounded-xl font-bold text-sm hover:bg-brand-secondary hover:text-white transition-all">لوحة التحكم</Link>
                  )}
                  {profile?.role === 'customer' && (
                    <Link to="/orders" className="text-stone-600 hover:text-brand-primary transition-colors font-bold text-sm">طلباتي</Link>
                  )}
                  <div className="h-8 w-[1px] bg-stone-200 mx-2"></div>
                  <Link to="/profile" className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 overflow-hidden border-2 border-white shadow-sm hover:border-brand-primary transition-all">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={24} />
                    )}
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-stone-600 hover:text-brand-primary font-bold text-sm">دخول</Link>
                  <Link to="/register" className="btn-primary py-3 px-8 text-sm">سجل الآن</Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-stone-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-cream border-t border-stone-200/50 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <Link to="/" className="block text-lg text-stone-600 font-bold" onClick={() => setIsOpen(false)}>الرئيسية</Link>
              <Link to="/meals" className="block text-lg text-stone-600 font-bold" onClick={() => setIsOpen(false)}>الأكلات</Link>
              <Link to="/chefs" className="block text-lg text-stone-600 font-bold" onClick={() => setIsOpen(false)}>الطهاة</Link>
              <Link to="/about" className="block text-lg text-stone-600 font-bold" onClick={() => setIsOpen(false)}>من نحن</Link>
              <Link to="/cart" className="block text-lg text-stone-600" onClick={() => setIsOpen(false)}>السلة (0)</Link>
              <hr className="border-stone-100" />
              {user ? (
                <>
                  {profile?.role === 'chef' && (
                    <Link to="/dashboard" className="block text-lg text-brand-secondary" onClick={() => setIsOpen(false)}>لوحة التحكم</Link>
                  )}
                  {profile?.role === 'customer' && (
                    <Link to="/orders" className="block text-lg text-stone-600" onClick={() => setIsOpen(false)}>طلباتي</Link>
                  )}
                  <Link to="/profile" className="block text-lg text-stone-600" onClick={() => setIsOpen(false)}>الملف الشخصي</Link>
                  <button onClick={handleLogout} className="block text-lg text-red-500">تسجيل الخروج</button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" className="btn-secondary text-center" onClick={() => setIsOpen(false)}>تسجيل الدخول</Link>
                  <Link to="/register" className="btn-primary text-center" onClick={() => setIsOpen(false)}>إنشاء حساب</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { ShoppingCart, User as UserIcon, LogOut, Menu, X, Utensils } from 'lucide-react';
import { useState } from 'react';
import { auth } from '../firebase';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  user: User | null;
  profile: UserProfile | null;
}

export default function Navbar({ user, profile }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-brand-cream/70 backdrop-blur-2xl sticky top-0 z-50 border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-[60px] h-[48px] flex items-center justify-center overflow-hidden mix-blend-multiply contrast-[1.1]"
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
          <div className="hidden md:flex items-center gap-12">
            <div className="flex items-center gap-10">
              <Link to="/" className="relative text-brand-secondary hover:text-brand-primary transition-all font-black text-sm uppercase tracking-[0.2em] group">
                الرئيسية
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/meals" className="relative text-brand-secondary hover:text-brand-primary transition-all font-black text-sm uppercase tracking-[0.2em] group">
                الأكلات
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/chefs" className="relative text-brand-secondary hover:text-brand-primary transition-all font-black text-sm uppercase tracking-[0.2em] group">
                الطهاة
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/about" className="relative text-brand-secondary hover:text-brand-primary transition-all font-black text-sm uppercase tracking-[0.2em] group">
                من نحن
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            
            <div className="flex items-center gap-6 mr-6 border-r border-brand-secondary/10 pr-6">
              <Link to="/cart" className="p-3 text-brand-secondary hover:text-brand-primary relative bg-white/50 rounded-2xl transition-all border border-white/50 shadow-sm">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-lg shadow-brand-primary/30">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-4">
                  {profile?.role === 'chef' && (
                    <Link to="/dashboard" className="bg-brand-secondary text-white px-5 py-2.5 rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-brand-secondary/20">لوحة التحكم</Link>
                  )}
                  {profile?.role === 'customer' && (
                    <Link to="/orders" className="text-brand-secondary hover:text-brand-primary transition-colors font-black text-sm">طلباتي</Link>
                  )}
                  <div className="h-8 w-[1px] bg-brand-secondary/10 mx-2"></div>
                  <Link to="/profile" className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-secondary overflow-hidden border-2 border-white shadow-xl hover:border-brand-primary transition-all">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={24} />
                    )}
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-brand-secondary/40 hover:text-brand-primary transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <Link to="/login" className="text-brand-secondary hover:text-brand-primary font-black text-sm uppercase tracking-widest">دخول</Link>
                  <Link to="/register" className="btn-primary py-3.5 px-8 text-sm">سجل الآن</Link>
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
              <Link to="/cart" className="block text-lg text-stone-600 font-bold flex items-center justify-between" onClick={() => setIsOpen(false)}>
                <span>السلة</span>
                {cartCount > 0 && <span className="bg-brand-primary text-white text-xs px-2 py-1 rounded-full">{cartCount}</span>}
              </Link>
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

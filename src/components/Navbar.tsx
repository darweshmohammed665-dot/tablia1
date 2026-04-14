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
    <nav className="bg-white sticky top-0 z-50 border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="https://i.ibb.co/3y9wLQc5/1775915563891.png" alt="طبلية" className="h-10 w-auto" referrerPolicy="no-referrer" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/meals" className="text-stone-600 hover:text-brand-primary transition-colors font-medium text-sm">الأكلات</Link>
            <Link to="/chefs" className="text-stone-600 hover:text-brand-primary transition-colors font-medium text-sm">المطابخ</Link>
            <Link to="/about" className="text-stone-600 hover:text-brand-primary transition-colors font-medium text-sm">كيف يعمل؟</Link>
            
            <div className="h-6 w-px bg-stone-200 mx-2"></div>
            
            <Link to="/cart" className="p-2 text-stone-600 hover:text-brand-primary relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 overflow-hidden border border-stone-200">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={16} />
                  )}
                </Link>
                <button onClick={handleLogout} className="text-stone-400 hover:text-red-500 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-stone-600 hover:text-brand-primary font-medium text-sm">دخول</Link>
                <Link to="/register" className="bg-brand-primary text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-brand-primary/90 transition-all">سجل الآن</Link>
              </div>
            )}
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
              <Link to="/chefs" className="block text-lg text-stone-600 font-bold" onClick={() => setIsOpen(false)}>المطابخ</Link>
              <Link to="/about" className="block text-lg text-stone-600 font-bold" onClick={() => setIsOpen(false)}>من نحن</Link>
              <Link to="/join-us" className="block text-lg text-stone-600 font-bold" onClick={() => setIsOpen(false)}>انضم إلينا</Link>
              <Link to="/cart" className="block text-lg text-stone-600 font-bold flex items-center justify-between" onClick={() => setIsOpen(false)}>
                <span>السلة</span>
                {cartCount > 0 && <span className="bg-brand-primary text-white text-xs px-2 py-1 rounded-full">{cartCount}</span>}
              </Link>
              <hr className="border-stone-100" />
              {user ? (
                <>
                  <Link to="/profile" className="block text-lg text-brand-secondary font-bold" onClick={() => setIsOpen(false)}>
                    {profile?.role === 'chef' ? 'لوحة التحكم' : 'حسابي وطلباتي'}
                  </Link>
                  <button onClick={handleLogout} className="block text-lg text-red-500 font-bold">تسجيل الخروج</button>
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

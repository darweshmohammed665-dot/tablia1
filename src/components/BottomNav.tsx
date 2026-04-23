import { Link, useLocation } from 'react-router-dom';
import { Home, Utensils, ChefHat, User, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { useCart } from '../context/CartContext';

interface BottomNavProps {
  profile: UserProfile | null;
}

export default function BottomNav({ profile }: BottomNavProps) {
  const location = useLocation();
  const { cartCount } = useCart();

  const tabs = [
    { id: '/', icon: Home, label: 'الرئيسية' },
    { id: '/meals', icon: Utensils, label: 'الأكلات' },
    { id: '/chefs', icon: ChefHat, label: 'المطابخ' },
    { id: '/cart', icon: ShoppingBag, label: 'السلة', count: cartCount },
    { id: profile?.role === 'chef' ? '/dashboard' : '/profile', icon: User, label: 'حسابي' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-t border-stone-100 px-2 pb-safe-offset-2">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.id;
          return (
            <Link
              key={tab.id}
              to={tab.id}
              className="relative flex flex-col items-center justify-center p-2 min-w-[64px]"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavBubble"
                  className="absolute inset-0 bg-brand-primary/10 rounded-2xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative">
                <tab.icon 
                  size={24} 
                  className={isActive ? 'text-brand-primary' : 'text-stone-400'} 
                />
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-primary text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold border-2 border-white">
                    {tab.count}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-bold ${isActive ? 'text-brand-primary' : 'text-stone-400'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

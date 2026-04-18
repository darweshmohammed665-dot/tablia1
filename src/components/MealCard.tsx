import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, ShoppingCart, Plus, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { FoodPriceDisplay } from './FoodPriceDisplay';

interface MealCardProps {
  meal: {
    id: string | number;
    title: string;
    price: number;
    image: string;
    chefId: string;
    chefName: string;
    rating?: number;
    deliveryTime?: number;
    description?: string;
    orderType?: 'instant' | 'preorder';
    reviewsCount?: number;
  };
  index?: number;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, index = 0 }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: meal.id.toString(),
      title: meal.title,
      price: meal.price,
      quantity: 1,
      image: meal.image,
      chefId: meal.chefId,
      chefName: meal.chefName,
      orderType: meal.orderType || 'instant'
    });

    const serviceFee = meal.price * 0.05;

    // Enhanced Toast with Image and Price
    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-black text-brand-accent">تمت الإضافة بنجاح!</span>
        <span className="text-sm font-bold text-stone-500">{meal.title} • {meal.price} ج.م</span>
        <span className="text-[10px] text-stone-400 font-bold">(رسوم خدمة: {serviceFee.toFixed(2)} ج.م)</span>
      </div>,
      {
        icon: <div className="bg-green-100 p-1 rounded-full text-green-600"><Plus size={16} strokeWidth={3} /></div>,
        duration: 3000,
        position: 'bottom-center'
      }
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2rem] overflow-hidden flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-300 border border-stone-100 group"
    >
      <div className="relative h-64 overflow-hidden group/img">
        <Link to={`/meal/${meal.id}`} className="block h-full">
          <img src={meal.image} alt={meal.title} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        
        {meal.orderType && (
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black shadow-lg pointer-events-none z-10 ${meal.orderType === 'instant' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
            {meal.orderType === 'instant' ? 'فوري' : 'طلب يوم بيومه'}
          </div>
        )}

        {/* Quick Add to Cart Button directly on the image */}
        <button 
          onClick={handleQuickAdd}
          className="absolute bottom-4 right-4 bg-brand-primary text-white p-3 rounded-full shadow-lg hover:scale-110 hover:bg-brand-accent transition-all z-10 flex items-center justify-center"
          title="إضافة فورية للسلة"
        >
          <Plus size={24} strokeWidth={3} />
        </button>

        <div className="absolute bottom-4 left-4 z-10 pointer-events-none transform scale-75 origin-bottom-left">
          <FoodPriceDisplay originalPrice={meal.price} />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <Link to={`/meal/${meal.id}`} className="text-2xl font-black text-brand-accent hover:text-brand-primary transition-colors leading-tight line-clamp-1">{meal.title}</Link>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 bg-brand-primary/10 px-3 py-1 rounded-xl text-brand-primary shrink-0">
              <Star size={16} className="fill-brand-primary" />
              <span className="text-sm font-black">{meal.rating || 0}</span>
            </div>
            {meal.reviewsCount !== undefined && (
              <span className="text-[10px] text-stone-400 font-bold">({meal.reviewsCount} تقييم)</span>
            )}
          </div>
        </div>
        <p className="text-stone-500 mb-6 flex items-center gap-2 text-sm font-bold">
          بواسطة <Link to={`/chef/${meal.chefId}`} className="text-brand-accent hover:underline">{meal.chefName}</Link>
        </p>
        <div className="mt-auto flex items-center justify-between pt-6 border-t border-stone-100">
          <div className="flex items-center gap-2 text-stone-400 text-sm font-black">
            <Clock size={16} /> {meal.deliveryTime || 45} دقيقة
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleQuickAdd}
              className="w-full bg-stone-900 text-white py-2.5 px-5 rounded-2xl text-sm font-black hover:bg-brand-primary transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              أضف للسلة
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

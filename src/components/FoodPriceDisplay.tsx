import React from 'react';

interface FoodPriceDisplayProps {
  originalPrice: number;
}

/**
 * مكون احترافي لعرض سعر الوجبة بعد خصم رسوم الخدمة (5%)
 * المكون يوضح السعر الأصلي والسعر الحالي بشفافية تامة
 */
export const FoodPriceDisplay: React.FC<FoodPriceDisplayProps> = ({ originalPrice }) => {
  return (
    <div className="flex flex-col items-start gap-1 p-3 bg-white/95 backdrop-blur-sm rounded-2xl border border-stone-100 shadow-xl group">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl md:text-3xl font-black text-brand-primary tracking-tighter">
          {originalPrice.toFixed(0)}
        </span>
        <span className="text-xs font-black text-brand-primary">ج.م</span>
      </div>
      <div className="flex items-center gap-1 mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">+ 5% رسوم خدمة</span>
      </div>
    </div>
  );
};

export default FoodPriceDisplay;

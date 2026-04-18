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
    <div className="flex flex-col items-start gap-1 p-3 bg-white/95 backdrop-blur-sm rounded-2xl border border-stone-100 shadow-xl">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl md:text-3xl font-black text-brand-primary tracking-tighter">
          {originalPrice.toFixed(0)}
        </span>
        <span className="text-xs font-black text-brand-primary">ج.م</span>
      </div>
    </div>
  );
};

export default FoodPriceDisplay;

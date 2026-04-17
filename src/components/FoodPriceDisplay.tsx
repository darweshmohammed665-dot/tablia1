import React from 'react';

interface FoodPriceDisplayProps {
  originalPrice: number;
}

/**
 * مكون احترافي لعرض سعر الوجبة بعد خصم رسوم الخدمة (5%)
 * المكون يوضح السعر الأصلي والسعر الحالي بشفافية تامة
 */
export const FoodPriceDisplay: React.FC<FoodPriceDisplayProps> = ({ originalPrice }) => {
  // 1. حساب قيمة الخصم (5%)
  const commission = originalPrice * 0.05;

  // 2. حساب السعر النهائي اللي هيظهر للعميل
  const finalPrice = originalPrice - commission;

  return (
    <div className="flex flex-col items-start gap-1 p-3 bg-stone-50 rounded-2xl border border-stone-100">
      <div className="flex items-center gap-2">
        <span className="text-stone-400 line-through text-sm font-bold">
          {originalPrice.toFixed(2)} ج.م
        </span>
        <span className="bg-brand-primary/10 text-brand-primary text-[10px] px-2 py-0.5 rounded-full font-black">
          خصم الخدمة %5
        </span>
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-brand-accent italic">
          {finalPrice.toFixed(2)}
        </span>
        <span className="text-xs font-black text-brand-accent">ج.م</span>
      </div>
      
      <p className="text-[10px] text-stone-500 font-bold mt-1">
        * تم خصم رسوم الخدمة من السعر الأصلي
      </p>
    </div>
  );
};

export default FoodPriceDisplay;

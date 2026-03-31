import React from 'react';
import { CheckCircle2, Clock, Utensils, Truck, PackageCheck, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderStatusTrackerProps {
  status: 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
}

const steps = [
  { id: 'pending', label: 'قيد الانتظار', icon: Clock },
  { id: 'preparing', label: 'جاري التحضير', icon: Utensils },
  { id: 'out_for_delivery', label: 'في الطريق', icon: Truck },
  { id: 'delivered', label: 'تم التوصيل', icon: PackageCheck },
];

export default function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-2xl">
        <XCircle size={24} />
        <span className="font-bold">تم إلغاء الطلب</span>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(step => step.id === status);

  return (
    <div className="w-full py-6">
      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-100 -translate-y-1/2 z-0"></div>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          className="absolute top-1/2 left-0 h-1 bg-brand-primary -translate-y-1/2 z-0"
        ></motion.div>

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isCompleted ? 'bg-brand-primary text-white' : 
                  isActive ? 'bg-brand-primary text-white ring-4 ring-brand-primary/20 scale-110' : 
                  'bg-white text-stone-300 border-2 border-stone-100'
                }`}
              >
                {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} />}
              </div>
              <span className={`text-xs font-bold whitespace-nowrap ${
                isActive ? 'text-brand-primary' : 
                isCompleted ? 'text-stone-900' : 
                'text-stone-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

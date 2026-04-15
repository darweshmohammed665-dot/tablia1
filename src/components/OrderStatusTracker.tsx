import React from 'react';
import { CheckCircle2, Clock, Utensils, Truck, PackageCheck, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderStatusTrackerProps {
  status: 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
}

const steps = [
  { id: 'pending', label: 'قيد الانتظار', icon: Clock, description: 'تم استلام طلبك' },
  { id: 'preparing', label: 'جاري التحضير', icon: Utensils, description: 'الشيف بيجهز الأكل' },
  { id: 'out_for_delivery', label: 'في الطريق', icon: Truck, description: 'الطلب مع المندوب' },
  { id: 'delivered', label: 'تم التوصيل', icon: PackageCheck, description: 'بالهنا والشفا' },
];

export default function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  if (status === 'cancelled') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-4 text-red-500 bg-red-50/50 border border-red-100 p-6 rounded-[2rem]"
      >
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
          <XCircle size={28} />
        </div>
        <div>
          <span className="font-black text-lg block">تم إلغاء الطلب</span>
          <span className="text-sm text-red-400 font-medium">نعتذر عن عدم إتمام طلبك هذه المرة.</span>
        </div>
      </motion.div>
    );
  }

  const currentStepIndex = steps.findIndex(step => step.id === status);

  return (
    <div className="w-full py-10">
      <div className="relative flex justify-between">
        {/* Progress Line Background */}
        <div className="absolute top-8 left-0 w-full h-2 bg-brand-cream rounded-full -translate-y-1/2 z-0"></div>
        
        {/* Animated Progress Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute top-8 left-0 h-2 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full -translate-y-1/2 z-0"
        ></motion.div>

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-4 w-1/4">
              <motion.div 
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isCompleted || isActive ? '#c65d3a' : '#ffffff',
                  borderColor: isCompleted || isActive ? '#c65d3a' : '#f5f5f4',
                  color: isCompleted || isActive ? '#ffffff' : '#d6d3d1'
                }}
                transition={{ duration: 0.4 }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border-4 relative ${
                  isActive ? 'ring-8 ring-brand-primary/20' : ''
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="pulse"
                    className="absolute inset-0 rounded-2xl bg-brand-primary/20"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle2 size={28} />
                  </motion.div>
                ) : (
                  <Icon size={28} />
                )}
              </motion.div>
              
              <div className="text-center">
                <span className={`block text-sm font-black mb-1 transition-colors duration-300 ${
                  isActive ? 'text-brand-primary' : 
                  isCompleted ? 'text-stone-900' : 
                  'text-stone-400'
                }`}>
                  {step.label}
                </span>
                <span className={`hidden md:block text-[10px] font-bold transition-colors duration-300 ${
                  isActive ? 'text-stone-500' : 'text-stone-300'
                }`}>
                  {step.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

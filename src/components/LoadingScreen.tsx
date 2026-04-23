import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRetry(true);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white overflow-hidden">
      {/* Background with a very subtle warm gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-stone-50/30 to-white" />
      
      <div className="relative flex flex-col items-center">
        
        {/* Illustration Container */}
        <div className="relative w-72 h-80 flex items-center justify-center">
          
          {/* Steam / Hearts Animation */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full flex justify-center">
            {/* Steam trails */}
            {[0, 0.5, 1, 1.5].map((delay, i) => (
              <motion.div
                key={`steam-${i}`}
                initial={{ opacity: 0, y: 40, scale: 0.5 }}
                animate={{ 
                  opacity: [0, 0.4, 0],
                  y: [40, -80],
                  scale: [1, 2],
                  filter: ["blur(4px)", "blur(12px)"]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeOut"
                }}
                className="absolute w-1 h-12 bg-stone-200/50 rounded-full"
                style={{ left: `${40 + (i * 10)}%` }}
              />
            ))}

            {/* Floating Hearts like the image */}
            {[0.2, 0.8, 1.4].map((delay, i) => (
              <motion.div
                key={`heart-${i}`}
                initial={{ opacity: 0, y: 20, scale: 0, rotate: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  y: [20, -100],
                  x: [(i - 1) * 20, (i - 1) * 30 + Math.sin(i) * 20],
                  scale: [0.5, 1, 1.2, 1],
                  rotate: [0, i % 2 === 0 ? 15 : -15, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeInOut"
                }}
                className="absolute text-brand-primary/40 select-none"
                style={{ left: '50%', fontSize: '1.5rem' }}
              >
                ♥
              </motion.div>
            ))}
          </div>

          {/* The "Drawn" Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* SVG Drawing mimicking the user's reference */}
            <svg width="240" height="200" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* The Book (at the bottom) */}
              <motion.path 
                d="M40 160C40 155 45 150 55 150H185C195 150 200 155 200 160V180C200 185 195 190 185 190H55C45 190 40 185 40 180V160Z" 
                fill="#E8F5E9" 
                stroke="#2E7D32" 
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2 }}
              />
              <path d="M40 175H200" stroke="#2E7D32" strokeWidth="1" strokeOpacity="0.3" />
              
              {/* The Bowl */}
              <motion.path 
                d="M60 90C60 90 65 150 120 150C175 150 180 90 180 90H60Z" 
                fill="#FFEBEE" 
                stroke="#C62828" 
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              
              {/* The Whisk Handle */}
              <motion.g
                initial={{ rotate: -10, originX: '120px', originY: '120px' }}
                animate={{ rotate: [ -10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Whisk handle */}
                <rect x="115" y="40" width="10" height="60" rx="5" fill="#B71C1C" />
                {/* Whisk loops inside the bowl */}
                <path d="M100 100C100 120 140 120 140 100" stroke="#2D2D2D" strokeWidth="2" strokeOpacity="0.6" />
                <path d="M110 100C110 115 130 115 130 100" stroke="#2D2D2D" strokeWidth="2" strokeOpacity="0.4" />
              </motion.g>

              {/* Liquid inside bowl */}
              <path d="M70 100Q120 110 170 100" stroke="#C62828" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
            
            {/* Subtle heat glow under the bowl */}
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 w-40 h-10 bg-brand-primary/10 blur-[20px] rounded-full"
            />
          </motion.div>
        </div>

        {/* Branding */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-center mt-8"
        >
          <h1 className="text-5xl font-black text-brand-secondary tracking-tighter italic font-serif">طبلية</h1>
          <p className="text-stone-400 font-bold mt-2 tracking-[0.3em] uppercase text-xs">أصل الأكل البيتي</p>

          
          {showRetry && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12"
            >
              <button 
                onClick={() => window.location.reload()}
                className="group flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
              >
                <RefreshCw size={20} className="text-stone-400 group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-[10px] font-bold text-stone-400 tracking-widest uppercase">تحديث الاتصال</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}





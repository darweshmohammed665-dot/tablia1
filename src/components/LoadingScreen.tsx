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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white overflow-hidden selection:bg-none">
      {/* Background: Pure white with a very subtle architectural grid or radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(241,29,88,0.02)_0%,_transparent_70%)]" />
      
      <div className="relative flex flex-col items-center">
        
        {/* Central Stage: Using a glassmorphism base for the icon */}
        <div className="relative w-80 h-80 flex items-center justify-center">
          
          {/* Subtle Rotating Ring for secondary motion */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-64 h-64 border border-stone-100 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-[248px] h-[248px] border border-dashed border-stone-200/50 rounded-full"
          />

          {/* Steam: More organic and flowing using multiple fine trails */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 flex justify-center pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`steam-pro-${i}`}
                initial={{ opacity: 0, y: 60, scale: 0.8 }}
                animate={{ 
                  opacity: [0, 0.4, 0.6, 0.2, 0],
                  y: [60, -100, -180],
                  x: [0, (i - 2.5) * 12, (i - 2.5) * 20 + Math.sin(i * 10) * 30],
                  scale: [0.8, 1.2, 1.8],
                  filter: ["blur(4px)", "blur(12px)", "blur(24px)"]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="absolute w-2 h-24 bg-gradient-to-t from-stone-200/30 via-stone-100/10 to-transparent rounded-full"
              />
            ))}
          </div>

          {/* Floating Hearts: Small, elegant, and rare */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 flex justify-center">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`heart-pro-${i}`}
                initial={{ opacity: 0, y: 40, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.6, 0.6, 0],
                  y: [40, -120],
                  x: [(i - 1) * 30, (i - 1) * 50 + Math.cos(i) * 20],
                  scale: [0.4, 0.8, 0.6],
                  rotate: [0, i % 2 === 0 ? 20 : -20]
                }}
                transition={{ 
                  duration: 7,
                  repeat: Infinity,
                  delay: 2 + (i * 2.5),
                  ease: "easeInOut"
                }}
                className="absolute text-brand-primary/30"
                style={{ fontSize: '1.2rem' }}
              >
                ♥
              </motion.div>
            ))}
          </div>

          {/* Central Icon: Stylized Fine-Line Illustration */}
          <div className="relative z-10 w-56 h-56 flex items-center justify-center">
            <svg width="200" height="180" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Foundation: The Book */}
              <motion.path 
                d="M40 140C40 135 45 130 55 130H145C155 130 160 135 160 140V155C160 160 155 165 145 165H55C45 165 40 160 40 155V140Z" 
                stroke="#2D2D2D" 
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <motion.path 
                d="M40 152H160" 
                stroke="#2D2D2D" 
                strokeWidth="1" 
                strokeOpacity="0.2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              />

              {/* Focus: The Bowl - Clean and technical, but with a slight organic taper */}
              <motion.path 
                d="M60 85C60 85 64 135 100 135C136 135 140 85 140 85H60Z" 
                stroke="#F11D58" 
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Detail: The Whisk - Smooth rhythmic stirring animation */}
              <motion.g
                initial={{ rotate: -8, originX: '100px', originY: '110px' }}
                animate={{ rotate: [ -8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Whisk Handle */}
                <rect x="97" y="45" width="6" height="45" rx="3" fill="#F11D58" />
                {/* Whisk Wires (Multiple overlapping loops) */}
                <path d="M88 95C88 112 112 112 112 95" stroke="#2D2D2D" strokeWidth="1.5" strokeOpacity="0.4" />
                <path d="M93 95C93 108 107 108 107 95" stroke="#2D2D2D" strokeWidth="1.5" strokeOpacity="0.3" />
              </motion.g>

              {/* Content Indicator: Dotted liquid line */}
              <motion.path 
                d="M70 95Q100 102 130 95" 
                stroke="#F11D58" 
                strokeWidth="1" 
                strokeDasharray="3 3"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </svg>

            {/* Glowing Aura directly under bowl */}
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-16 w-32 h-8 bg-brand-primary/5 blur-[25px] rounded-full"
            />
          </div>
        </div>

        {/* Branding & Feedback */}
        <div className="text-center mt-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <h1 className="text-4xl font-bold tracking-tighter text-stone-900 flex items-center justify-center gap-2">
              <span className="font-serif italic font-black text-brand-secondary">طبلية</span>
              <motion.span 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-brand-primary"
              />
            </h1>
            <p className="text-stone-400 font-medium mt-3 text-xs tracking-[0.4em] uppercase">
              قـصـة حـب لـلأكـل الـبـيـتـي
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <div className="mt-12 w-48 h-0.5 bg-stone-100 mx-auto overflow-hidden rounded-full">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1/2 h-full bg-brand-primary shadow-[0_0_10px_rgba(241,29,88,0.5)]"
            />
          </div>

          {showRetry && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10"
            >
              <button 
                onClick={() => window.location.reload()}
                className="group flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-all"
              >
                <RefreshCw size={18} className="text-stone-400 group-hover:rotate-180 transition-transform duration-700" />
                <span className="text-[9px] font-bold text-stone-400 tracking-[0.2em] uppercase">تـحديث الـصـفـحـة</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}





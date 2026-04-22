import { motion } from 'motion/react';
import { UtensilsCrossed, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRetry(true);
    }, 10000); // Show retry after 10 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center p-6 text-center"
      >
        {/* Whisk and Bowl Illustration Replacement with Lucide */}
        <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-brand-primary"
          >
            <UtensilsCrossed size={80} strokeWidth={1.5} />
          </motion.div>
          
          {/* Floating Hearts */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                y: -60,
                x: (i - 2) * 30
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut"
              }}
              className="absolute top-0 left-1/2 -translate-x-1/2 text-brand-primary"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          ))}
        </div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="mb-4">
             {/* Using a fallback for the potentially blocked ibb.co logo */}
             <div className="h-16 flex items-center justify-center">
                 <img 
                    src="https://i.ibb.co/3y9wLQc5/1775915563891.png" 
                    alt="طبلية" 
                    className="h-full w-auto" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                 />
                 <h1 className="text-3xl font-black text-brand-secondary">طبلية</h1>
             </div>
          </div>
          
          <div className="flex gap-2 justify-center mb-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-3 h-3 rounded-full bg-brand-primary"
              />
            ))}
          </div>

          {showRetry && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 space-y-4"
            >
              <p className="text-stone-500 font-medium">يبدو أن الاتصال بطيء قليلاً...</p>
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-brand-accent transition-all mx-auto"
              >
                <RefreshCw size={18} />
                إعادة المحاولة
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}


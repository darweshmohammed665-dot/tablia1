import { motion } from 'motion/react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center"
      >
        {/* Whisk and Bowl Illustration Container */}
        <div className="relative w-48 h-48 mb-8">
          {/* Main Illustration */}
          <motion.div
            animate={{ 
              rotate: [0, -5, 5, -5, 0],
              y: [0, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <img 
              src="https://cdn-icons-png.flaticon.com/512/3014/3014512.png" 
              alt="Cooking" 
              className="w-32 h-32 object-contain grayscale-[0.2] contrast-[1.1]"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          {/* Floating Hearts */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                y: -50,
                x: (i - 2) * 20
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut"
              }}
              className="absolute top-0 left-1/2 -translate-x-1/2 text-brand-primary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
          <img src="https://i.ibb.co/3y9wLQc5/1775915563891.png" alt="طبلية" className="h-16 w-auto mx-auto mb-4" referrerPolicy="no-referrer" />
          <div className="flex gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 rounded-full bg-brand-primary"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

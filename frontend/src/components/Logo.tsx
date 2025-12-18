import React from 'react';
import { motion } from 'framer-motion';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-400"
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(168, 85, 247, 0.7)',
            '0 0 0 10px rgba(168, 85, 247, 0)',
            '0 0 0 0 rgba(168, 85, 247, 0.7)',
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        <motion.div
          className="absolute h-8 w-8 rounded-full bg-purple-500/20"
          animate={{
            scale: [1, 1.5, 1.5, 1],
            opacity: [0.7, 0.4, 0.1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
        <span className="font-serif text-lg font-bold tracking-tight text-white">LL</span>
      </motion.div>
      <div className="leading-tight">
        <span className="text-sm font-semibold tracking-tight sm:text-base">LandLeverage</span>
        <p className="text-[10px] text-slate-400 sm:text-xs">
          Own the ground where the next decade is built
        </p>
      </div>
    </div>
  );
};

export default Logo;

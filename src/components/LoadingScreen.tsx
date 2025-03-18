import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="w-24 h-24 md:w-32 md:h-32 relative mb-6">
        <motion.img 
          src="https://i.postimg.cc/qMYWSV1h/Untitled-design-12.png"
          alt="Epitome IAS Logo"
          className="w-full h-full object-contain"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div 
          className="absolute inset-0 border-4 border-transparent border-t-[var(--primary-blue)] border-r-[var(--primary-red)] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.h2 
        className="text-lg md:text-xl text-gray-700 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Loading amazing content...
      </motion.h2>
      <motion.div 
        className="mt-4 flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="w-3 h-3 bg-[var(--primary-blue)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
        <span className="w-3 h-3 bg-[var(--primary-red)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
        <span className="w-3 h-3 bg-[var(--primary-blue)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
      </motion.div>
    </div>
  );
};

export default LoadingScreen; 
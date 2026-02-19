// src/components/admin/DeleteConfirmModal.jsx
import { motion, AnimatePresence } from 'framer-motion';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Dark overlay */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal box */}
        <motion.div 
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          className="relative bg-card p-8 rounded-[32px] shadow-2xl max-w-md w-full text-center z-10"
        >
          <h2 className="text-3xl font-bold text-red-500 mb-6">TU ES SUR MA REUS ??????</h2>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={onConfirm}
              className="px-6 py-4 bg-primary text-card font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Shrek je t'aime
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-4 bg-secondary/20 text-secondary font-bold rounded-xl hover:bg-secondary/30 transition-colors"
            >
              Non je suis gay
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
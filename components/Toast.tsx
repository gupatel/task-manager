'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  message: string;
  onUndo: () => void;
  visible: boolean;
}

export default function Toast({ message, onUndo, visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-gray-800 dark:bg-gray-700 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg z-50"
        >
          <span>{message}</span>
          <button
            onClick={onUndo}
            className="text-teal-400 font-medium hover:text-teal-300 transition-colors"
          >
            Undo
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/task';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityStyles = {
  high: 'bg-red-50 text-red-800',
  medium: 'bg-amber-50 text-amber-800',
  low: 'bg-green-50 text-green-800',
};

export default function TaskCard({ task, onToggle, onDelete }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.18 }}
      className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-none"
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
          ${task.completed
            ? 'bg-teal-500 border-teal-500'
            : 'border-gray-300 hover:border-brand'
          }`}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.15 }}
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>

      <span className={`flex-1 text-sm transition-colors duration-200 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
        {task.text}
      </span>

      <span className={`text-xs px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${priorityStyles[task.priority]}`}>
        {task.priority}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-300 hover:text-red-400 transition-colors"
        aria-label="Delete task"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </motion.div>
  );
}
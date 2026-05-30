'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types/task';
import { useState, useRef } from 'react';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string, newDueDate?: string) => void;
}

const priorityStyles = {
  high: 'bg-red-50 text-red-800',
  medium: 'bg-amber-50 text-amber-800',
  low: 'bg-green-50 text-green-800',
};

function isOverdue(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, month, day] = dateStr.split('-').map(Number);
  const due = new Date(year, month - 1, day);
  return due < today;
}

function formatDue(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, month, day] = dateStr.split('-').map(Number);
  const due = new Date(year, month - 1, day);
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: 'Overdue', color: 'text-red-500' };
  if (diff === 0) return { label: 'Due today', color: 'text-amber-500' };
  if (diff === 1) return { label: 'Due tomorrow', color: 'text-amber-400' };
  return { label: `Due ${due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, color: 'text-gray-400' };
}

export default function TaskCard({ task, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleSave = () => {
    onEdit(task.id, editText.trim() || task.text, editDueDate || undefined);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditDueDate(task.dueDate || '');
    setEditing(false);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.18 }}
      className={`flex items-center gap-2 sm:gap-3 py-3 border-b border-gray-100 last:border-none border-l-4 transition-colors
        ${!task.completed && task.dueDate && isOverdue(task.dueDate)
          ? 'border-l-red-400 pl-2'
          : 'border-l-transparent'
        }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-200 hover:text-gray-400 cursor-grab active:cursor-grabbing shrink-0"
        aria-label="Drag to reorder"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
        </svg>
      </button>

      <button
        onClick={() => onToggle(task.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
          ${task.completed ? 'bg-teal-500 border-teal-500' : 'border-gray-300 hover:border-brand'}`}
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

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {editing ? (
          <>
            <input
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              autoFocus
              className="w-full text-sm border border-teal-400 rounded px-2 py-0.5 outline-none bg-white text-gray-700"
            />
            <input
              type="date"
              value={editDueDate}
              onChange={e => setEditDueDate(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded px-2 py-0.5 outline-none text-gray-500"
            />
            <div className="flex gap-2 mt-1">
              <button
                onClick={handleSave}
                className="text-xs px-2 py-0.5 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <span className={`text-sm truncate transition-colors duration-200
              ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {task.text}
            </span>
            {task.dueDate && (() => {
              const { label, color } = formatDue(task.dueDate);
              return (
                <span className={`text-xs ${task.completed ? 'text-gray-300' : color}`}>
                  {label}
                </span>
              );
            })()}
          </>
        )}
      </div>

      <span className={`text-xs px-2 py-0.5 rounded-full capitalize shrink-0 hidden sm:inline ${priorityStyles[task.priority]}`}>
        {task.priority}
      </span>

      {!task.completed && !editing && (
        <button
          onClick={() => setEditing(true)}
          className="text-gray-300 hover:text-teal-400 transition-colors shrink-0"
          aria-label="Edit task"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
          </svg>
        </button>
      )}

      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
        aria-label="Delete task"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </motion.div>
  );
}
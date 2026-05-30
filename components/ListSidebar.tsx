'use client';

import { useState } from 'react';
import { TaskList } from '@/types/task';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  lists: TaskList[];
  activeListId: string;
  onSelect: (id: string) => void;
  onAdd: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export default function ListSidebar({ lists, activeListId, onSelect, onAdd, onRename, onDelete }: Props) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd(newName.trim());
    setNewName('');
    setAdding(false);
  };

  const handleRename = (id: string) => {
    if (!renameText.trim()) return;
    onRename(id, renameText.trim());
    setRenamingId(null);
  };

  return (
    <div className="w-48 shrink-0 flex flex-col gap-1 pr-4 border-r border-gray-100 dark:border-gray-700 min-h-full">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
        My Lists
      </p>

      {lists.map(list => (
        <div key={list.id} className="group relative">
          {renamingId === list.id ? (
            <input
              value={renameText}
              onChange={e => setRenameText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleRename(list.id);
                if (e.key === 'Escape') setRenamingId(null);
              }}
              onBlur={() => handleRename(list.id)}
              autoFocus
              className="w-full text-sm px-2 py-1.5 rounded-lg border border-brand outline-none dark:bg-gray-700 dark:text-gray-200"
            />
          ) : (
            <button
              onClick={() => onSelect(list.id)}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors truncate
                ${activeListId === list.id
                  ? 'bg-brand-light text-brand-text font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {list.name}
            </button>
          )}

          {/* rename / delete buttons on hover */}
          {renamingId !== list.id && (
            <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-0.5">
              <button
                onClick={() => { setRenamingId(list.id); setRenameText(list.name); }}
                className="p-0.5 text-gray-300 hover:text-teal-400 transition-colors"
                aria-label="Rename list"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
                </svg>
              </button>
              {lists.length > 1 && (
                <button
                  onClick={() => onDelete(list.id)}
                  className="p-0.5 text-gray-300 hover:text-red-400 transition-colors"
                  aria-label="Delete list"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {/* add new list */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAdd();
                if (e.key === 'Escape') { setAdding(false); setNewName(''); }
              }}
              onBlur={() => { if (!newName.trim()) setAdding(false); }}
              autoFocus
              placeholder="List name..."
              className="w-full text-sm px-2 py-1.5 rounded-lg border border-brand outline-none dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-500"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setAdding(true)}
        className="mt-1 text-xs text-gray-400 hover:text-brand transition-colors text-left px-3 py-1"
      >
        + New list
      </button>
    </div>
  );
}
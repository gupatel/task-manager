'use client';

import { useState } from 'react';
import { Priority } from '@/types/task';

interface Props {
  onAdd: (text: string, priority: Priority, dueDate?: string) => void;
}

export default function TaskInput({ onAdd }: Props) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text.trim(), priority, dueDate || undefined);
    setText('');
    setPriority('medium');
    setDueDate('');
  };

  return (
    <div className="flex flex-col gap-2 mb-5">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        placeholder="Add a new task..."
        autoComplete="off"
        className="w-full h-9 px-3 text-sm border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 rounded-lg outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />
      <div className="flex gap-2">
        <select
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
          className="flex-1 h-9 px-2 text-sm border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg outline-none focus:border-brand"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="flex-1 h-9 px-3 text-sm border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500 rounded-lg outline-none focus:border-brand"
        />
        <button
          onClick={handleAdd}
          className="h-9 px-4 text-sm text-white bg-brand rounded-lg hover:bg-brand/90 transition-colors whitespace-nowrap"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Priority } from '@/types/task';

interface Props {
  onAdd: (text: string, priority: Priority) => void;
}

export default function TaskInput({ onAdd }: Props) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text.trim(), priority);
    setText('');
    setPriority('medium');
  };

  return (
    <div className="flex gap-2 mb-5">
      <input
        type="text"
        autoComplete="off"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        placeholder="Add a new task..."
        className="flex-1 h-9 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />
      <select
        value={priority}
        onChange={e => setPriority(e.target.value as Priority)}
        className="h-9 px-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand"
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button
        onClick={handleAdd}
        className="h-9 px-4 text-sm text-white bg-brand rounded-lg hover:bg-brand/90 transition-colors"
      >
        + Add
      </button>
    </div>
  );
}
'use client';

import { Filter } from '@/types/task';

interface Props {
  current: Filter;
  onChange: (f: Filter) => void;
}

const filters: Filter[] = ['all', 'active', 'completed'];

export default function FilterBar({ current, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      {filters.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-4 py-1 text-xs rounded-full border transition-colors capitalize
            ${current === f
              ? 'bg-brand-light text-brand-text border-brand-border'
              : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
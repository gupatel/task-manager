'use client';

import { Filter } from '@/types/task';

interface Props {
  current: Filter;
  onChange: (f: Filter) => void;
  counts: Record<Filter, number>;
}

const filters: Filter[] = ['all', 'active', 'completed'];

export default function FilterBar({ current, onChange, counts }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      {filters.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-3 py-1 text-xs rounded-full border transition-colors capitalize flex items-center gap-1.5
            ${current === f
              ? 'bg-brand-light text-brand-text border-brand-border'
              : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
        >
          {f}
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${current === f ? 'bg-white/60 text-brand-text' : 'bg-gray-100 text-gray-400'}`}>
            {counts[f]}
          </span>
        </button>
      ))}
    </div>
  );
}
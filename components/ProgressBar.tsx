'use client';

interface Props {
  total: number;
  completed: number;
}

export default function ProgressBar({ total, completed }: Props) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mb-5">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Progress</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-500 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
'use client';

import { useEffect, useRef } from 'react'; // ← add useEffect, useRef
import confetti from 'canvas-confetti';    // ← add this
import { useTasks } from '@/hooks/useTasks';
import TaskInput from '@/components/TaskInput';
import FilterBar from '@/components/FilterBar';
import TaskList from '@/components/TaskList';
import ProgressBar from '@/components/ProgressBar';

export default function Home() {
  const {
    tasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    remainingCount,
    totalCount,
    reorderTasks,
    editTask,
  } = useTasks();

  const prevRemainingRef = useRef(remainingCount);  // ← add this

  // ← add this effect
  useEffect(() => {
    if (
      totalCount > 0 &&
      remainingCount === 0 &&
      prevRemainingRef.current !== 0
    ) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#14b8a6', '#f59e0b', '#6366f1', '#ec4899', '#10b981'],
      });
    }
    prevRemainingRef.current = remainingCount;
  }, [remainingCount, totalCount]);

  const counts = {
    all: totalCount,
    active: remainingCount,
    completed: totalCount - remainingCount,
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-start sm:items-center justify-center p-4 pt-8 sm:pt-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">My tasks</h1>
          <span className="text-xs bg-brand-light text-brand-text px-3 py-1 rounded-full">
            {remainingCount} remaining
          </span>
        </div>
        <ProgressBar total={totalCount} completed={totalCount - remainingCount} />
        <TaskInput onAdd={addTask} />
        <FilterBar current={filter} onChange={setFilter} counts={counts} />
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onReorder={reorderTasks}
          onEdit={editTask}
        />
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {totalCount - remainingCount} of {totalCount} completed
          </span>
          <button
            onClick={clearCompleted}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            Clear completed
          </button>
        </div>
      </div>
    </main>
  );
}
'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useTasks } from '@/hooks/useTasks';
import TaskInput from '@/components/TaskInput';
import FilterBar from '@/components/FilterBar';
import TaskList from '@/components/TaskList';
import ProgressBar from '@/components/ProgressBar';
import ThemeToggle from '@/components/ThemeToggle';
import Toast from '@/components/Toast';

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
    undoDelete,
    deletedTask,
  } = useTasks();

  const prevRemainingRef = useRef(remainingCount);

  useEffect(() => {
    if (totalCount > 0 && remainingCount === 0 && prevRemainingRef.current !== 0) {
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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-start sm:items-center justify-center p-4 pt-8 sm:pt-4 transition-colors duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">My Tasks</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="text-xs bg-brand-light text-brand-text px-3 py-1 rounded-full">
              {remainingCount} remaining
            </span>
          </div>
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
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-400 dark:text-gray-500">
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
      <Toast
        visible={!!deletedTask}
        message={`"${deletedTask?.text}" deleted`}
        onUndo={undoDelete}
      />
    </main>
  );
}
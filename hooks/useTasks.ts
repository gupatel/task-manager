import { useState, useEffect } from 'react';
import { Task, Filter, Priority } from '@/types/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text: string, priority: Priority, dueDate?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority,
      dueDate: dueDate || undefined,
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const editTask = (id: string, newText: string, newDueDate?: string) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, text: newText, dueDate: newDueDate } : t)
    );
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
  };

  const reorderTasks = (activeId: string, overId: string) => {
    setTasks(prev => {
      const oldIndex = prev.findIndex(t => t.id === activeId);
      const newIndex = prev.findIndex(t => t.id === overId);
      const updated = [...prev];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      return updated;
    });
  };

  const filteredTasks = tasks
  .filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  })
  .sort((a, b) => {
    // completed tasks always go to bottom
    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    // both have no due date — sort by createdAt
    if (!a.dueDate && !b.dueDate) return a.createdAt - b.createdAt;

    // no due date goes after tasks with due date
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;

    // both have due dates — sort earliest first (overdue at top)
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const remainingCount = tasks.filter(t => !t.completed).length;

  return {
    tasks: filteredTasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    remainingCount,
    totalCount: tasks.length,
    reorderTasks,
    editTask,
  };
}
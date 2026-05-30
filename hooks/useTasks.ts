import { useState, useEffect, useRef } from 'react';
import { Task, Filter, Priority } from '@/types/task';

export function useTasks(activeListId: string) { // ← add param
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [deletedTask, setDeletedTask] = useState<Task | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // reset filter when switching lists
  useEffect(() => {
    setFilter('all');
  }, [activeListId]);

  const addTask = (text: string, priority: Priority, dueDate?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority,
      dueDate: dueDate || undefined,
      createdAt: Date.now(),
      listId: activeListId, // ← add this
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    setTasks(prev => prev.filter(t => t.id !== id));
    setDeletedTask(task);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => setDeletedTask(null), 4000);
  };

  const undoDelete = () => {
    if (!deletedTask) return;
    setTasks(prev => [deletedTask, ...prev]);
    setDeletedTask(null);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
  };

  const editTask = (id: string, newText: string, newDueDate?: string) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, text: newText, dueDate: newDueDate } : t)
    );
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !(t.completed && t.listId === activeListId)));
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

  // filter tasks by active list
  const listTasks = tasks.filter(t => t.listId === activeListId);

  const filteredTasks = listTasks
    .filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (!a.dueDate && !b.dueDate) return a.createdAt - b.createdAt;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  const remainingCount = listTasks.filter(t => !t.completed).length;

  return {
    tasks: filteredTasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    undoDelete,
    deletedTask,
    clearCompleted,
    remainingCount,
    totalCount: listTasks.length,
    reorderTasks,
    editTask,
  };
}
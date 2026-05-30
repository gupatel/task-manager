import { useState, useEffect } from 'react';
import { TaskList } from '@/types/task';

const DEFAULT_LIST: TaskList = {
  id: 'default',
  name: 'Personal',
  createdAt: Date.now(),
};

export function useLists() {
  const [lists, setLists] = useState<TaskList[]>([DEFAULT_LIST]);
  const [activeListId, setActiveListId] = useState<string>('default');

  useEffect(() => {
    const stored = localStorage.getItem('lists');
    if (stored) setLists(JSON.parse(stored));
    const storedActive = localStorage.getItem('activeListId');
    if (storedActive) setActiveListId(storedActive);
  }, []);

  useEffect(() => {
    localStorage.setItem('lists', JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem('activeListId', activeListId);
  }, [activeListId]);

  const addList = (name: string) => {
    const newList: TaskList = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: Date.now(),
    };
    setLists(prev => [...prev, newList]);
    setActiveListId(newList.id);
  };

  const renameList = (id: string, name: string) => {
    setLists(prev =>
      prev.map(l => l.id === id ? { ...l, name: name.trim() } : l)
    );
  };

  const deleteList = (id: string) => {
    if (lists.length === 1) return; // keep at least one list
    setLists(prev => prev.filter(l => l.id !== id));
    if (activeListId === id) {
      const remaining = lists.filter(l => l.id !== id);
      setActiveListId(remaining[0].id);
    }
  };

  return {
    lists,
    activeListId,
    setActiveListId,
    addList,
    renameList,
    deleteList,
  };
}
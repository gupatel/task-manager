export type Priority = 'high' | 'medium' | 'low';

export type Filter = 'all' | 'active' | 'completed';

export interface TaskList {
  id: string;
  name: string;
  createdAt: number;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  createdAt: number;
  listId: string;
}
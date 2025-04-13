
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date | null;
  priority: Priority;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  title: string;
  description?: string;
  dueDate?: Date | null;
  priority: Priority;
  tags?: string[];
}

import { useState, useCallback } from 'react';
import { todoApi } from '../api/todo.api';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types';

interface UseTodosReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (params?: { search?: string; status?: string; priority?: string }) => Promise<void>;
  createTask: (payload: CreateTaskPayload) => Promise<Task>;
  updateTask: (id: string, payload: UpdateTaskPayload) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTodos = (): UseTodosReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (params?: { search?: string; status?: string; priority?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await todoApi.getTasks(params);
      setTasks(response.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (payload: CreateTaskPayload): Promise<Task> => {
    const task = await todoApi.createTask(payload);
    setTasks(prev => [task, ...prev]);
    return task;
  }, []);

  const updateTask = useCallback(async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
    const updated = await todoApi.updateTask(id, payload);
    setTasks(prev => prev.map(t => (t._id === id ? updated : t)));
    return updated;
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    await todoApi.deleteTask(id);
    setTasks(prev => prev.filter(t => t._id !== id));
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask, clearError };
};

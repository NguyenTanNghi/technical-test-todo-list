import React, { createContext, useContext, useState, useCallback } from "react";
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "../types";
import { todoApi } from "../api/todo.api";

interface TaskFilters {
    search: string;
    status: string;
    priority: string;
}

interface TaskContextValue {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    filters: TaskFilters;
    totalTasks: number;
    fetchTasks: (params?: Partial<TaskFilters>) => Promise<void>;
    createTask: (payload: CreateTaskPayload) => Promise<Task>;
    updateTask: (id: string, payload: UpdateTaskPayload) => Promise<Task>;
    deleteTask: (id: string) => Promise<void>;
    setFilters: (filters: Partial<TaskFilters>) => void;
    clearError: () => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalTasks, setTotalTasks] = useState(0);
    const [filters, setFiltersState] = useState<TaskFilters>({
        search: "",
        status: "",
        priority: "",
    });

    const fetchTasks = useCallback(
        async (params?: Partial<TaskFilters>) => {
            setIsLoading(true);
            setError(null);
            try {
                const mergedParams = { ...filters, ...params };
                const response = await todoApi.getTasks({
                    search: mergedParams.search || undefined,
                    status: mergedParams.status || undefined,
                    priority: mergedParams.priority || undefined,
                });
                setTasks(response.tasks);
                setTotalTasks(response.meta.total);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch tasks",
                );
            } finally {
                setIsLoading(false);
            }
        },
        [filters],
    );

    const createTask = useCallback(
        async (payload: CreateTaskPayload): Promise<Task> => {
            const newTask = await todoApi.createTask(payload);
            setTasks((prev) => [newTask, ...prev]);
            setTotalTasks((prev) => prev + 1);
            return newTask;
        },
        [],
    );

    const updateTask = useCallback(
        async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
            const updated = await todoApi.updateTask(id, payload);
            setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
            return updated;
        },
        [],
    );

    const deleteTask = useCallback(async (id: string): Promise<void> => {
        await todoApi.deleteTask(id);
        setTasks((prev) => prev.filter((t) => t._id !== id));
        setTotalTasks((prev) => prev - 1);
    }, []);

    const setFilters = useCallback((newFilters: Partial<TaskFilters>) => {
        setFiltersState((prev) => ({ ...prev, ...newFilters }));
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return (
        <TaskContext.Provider
            value={{
                tasks,
                isLoading,
                error,
                filters,
                totalTasks,
                fetchTasks,
                createTask,
                updateTask,
                deleteTask,
                setFilters,
                clearError,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = (): TaskContextValue => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTaskContext must be used within a TaskProvider");
    }
    return context;
};

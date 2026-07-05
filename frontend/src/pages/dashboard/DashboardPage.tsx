import React, { useEffect, useState } from "react";
import { Plus, Circle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { todoApi } from "../../api/todo.api";
import type { Task } from "../../types";
import {
    calculateTaskStats,
    formatDateShort,
    getPriorityClass,
    getStatusClass,
    truncateText,
} from "../../utils";
import TaskStatusChart from "../../components/todo/TaskStatusChart";
import TaskFormModal from "../../components/todo/TaskFormModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import { useDisclosure } from "../../hooks/useUtils";
import { useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const addModal = useDisclosure();

    const displayName = user ? user.firstName : "User";

    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await todoApi.getTasks();
            setTasks(response.tasks);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load tasks",
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const stats = calculateTaskStats(tasks);
    const todoTasks = tasks.filter((t) => t.status !== "Completed").slice(0, 3);
    const completedTasks = tasks
        .filter((t) => t.status === "Completed")
        .slice(0, 2);

    const handleCreateTask = async (
        payload: Parameters<typeof todoApi.createTask>[0],
    ) => {
        setIsCreating(true);
        try {
            await todoApi.createTask(payload);
            addModal.close();
            fetchTasks();
        } catch (err) {
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    const today = new Date();
    const todayStr = today.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
    });

    return (
        <div className="animate-fade-in w-full">
            {/* Welcome header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Welcome back, {displayName} 👋
                    </h2>
                </div>
            </div>

            {isLoading ? (
                <LoadingSpinner className="py-20" text="Loading tasks..." />
            ) : error ? (
                <ErrorState message={error} onRetry={fetchTasks} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* To-Do Column */}
                    <div className="bg-[var(--color-app-surface)] rounded-2xl border border-[var(--color-app-border)] shadow-sm p-5">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center">
                                    <svg
                                        width="11"
                                        height="11"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                    >
                                        <rect
                                            x="1"
                                            y="1"
                                            width="10"
                                            height="10"
                                            rx="2"
                                            stroke="var(--color-app-text-muted)"
                                            strokeWidth="1.2"
                                        />
                                        <circle
                                            cx="6"
                                            cy="6"
                                            r="1.5"
                                            fill="var(--color-app-text-muted)"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-[var(--color-primary)]">
                                    To-Do
                                </h3>
                            </div>
                            <button
                                onClick={addModal.open}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-[var(--color-primary)] transition-colors font-medium"
                            >
                                <Plus size={14} /> Add task
                            </button>
                        </div>

                        {/* Date */}
                        <p className="text-xs text-gray-400 mb-4">
                            {todayStr}{" "}
                            <span className="text-[var(--color-primary)] ml-1">
                                • Today
                            </span>
                        </p>

                        {/* Task list */}
                        <div className="space-y-3">
                            {todoTasks.length === 0 ? (
                                <EmptyState
                                    title="No tasks for today"
                                    description="Add a new task to get started."
                                    actionLabel="Add Task"
                                    onAction={addModal.open}
                                />
                            ) : (
                                todoTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className="task-card flex gap-3 p-3 rounded-xl border border-gray-100 cursor-pointer"
                                        onClick={() =>
                                            navigate(`/my-task/${task._id}`)
                                        }
                                    >
                                        <Circle
                                            size={14}
                                            className={`mt-0.5 flex-shrink-0 ${task.status === "In Progress" ? "text-blue-500" : "text-red-400"}`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-gray-900 leading-snug">
                                                {task.title}
                                            </h4>
                                            {task.description && (
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {truncateText(
                                                        task.description,
                                                        80,
                                                    )}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap gap-2 mt-1.5 text-xs">
                                                <span>
                                                    Priority:{" "}
                                                    <span
                                                        className={`font-medium ${getPriorityClass(task.priority)}`}
                                                    >
                                                        {task.priority}
                                                    </span>
                                                </span>
                                                <span>
                                                    Status:{" "}
                                                    <span
                                                        className={`font-medium ${getStatusClass(task.status)}`}
                                                    >
                                                        {task.status}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                        {task.image && (
                                            <img
                                                src={task.image}
                                                alt=""
                                                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                            />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-5">
                        {/* Task Status Chart */}
                        <TaskStatusChart stats={stats} />

                        {/* Completed Tasks */}
                        <div className="bg-[var(--color-app-surface)] rounded-2xl border border-[var(--color-app-border)] shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center">
                                    <svg
                                        width="11"
                                        height="11"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                    >
                                        <polyline
                                            points="1,6 4,9 11,2"
                                            stroke="#22c55e"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-[var(--color-primary)]">
                                    Completed Task
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {completedTasks.length === 0 ? (
                                    <p className="text-sm text-gray-400 text-center py-4">
                                        No completed tasks yet.
                                    </p>
                                ) : (
                                    completedTasks.map((task) => (
                                        <div
                                            key={task._id}
                                            className="task-card flex gap-3 p-3 rounded-xl border border-gray-100 cursor-pointer"
                                            onClick={() =>
                                                navigate(`/my-task/${task._id}`)
                                            }
                                        >
                                            <Circle
                                                size={14}
                                                className="mt-0.5 flex-shrink-0 text-green-500 fill-green-500"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-gray-900">
                                                    {task.title}
                                                </h4>
                                                {task.description && (
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {truncateText(
                                                            task.description,
                                                            60,
                                                        )}
                                                    </p>
                                                )}
                                                <p className="text-xs mt-1">
                                                    Status:{" "}
                                                    <span className="text-green-500 font-medium">
                                                        Completed
                                                    </span>
                                                </p>
                                                {task.updatedAt && (
                                                    <p className="text-xs text-gray-400">
                                                        Completed{" "}
                                                        {formatDateShort(
                                                            task.updatedAt,
                                                        )}{" "}
                                                        ago.
                                                    </p>
                                                )}
                                            </div>
                                            {task.image && (
                                                <img
                                                    src={task.image}
                                                    alt=""
                                                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                                />
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Task Modal */}
            <TaskFormModal
                isOpen={addModal.isOpen}
                onClose={addModal.close}
                onSubmit={
                    handleCreateTask as (
                        payload: import("../../types").CreateTaskPayload,
                    ) => Promise<void>
                }
                isLoading={isCreating}
            />
        </div>
    );
};

export default DashboardPage;

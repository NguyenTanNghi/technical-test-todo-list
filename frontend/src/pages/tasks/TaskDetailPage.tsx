import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Trash2, ArrowLeft } from "lucide-react";
import { todoApi } from "../../api/todo.api";
import { categoryApi } from "../../api/category.api";
import type { Task, UpdateTaskPayload } from "../../types";
import { formatDate, getPriorityClass, getStatusClass } from "../../utils";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import TaskFormModal from "../../components/todo/TaskFormModal";

const TaskDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [statuses, setStatuses] = useState<string[]>([]);
    const [priorities, setPriorities] = useState<string[]>([]);

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!id) return;
        const load = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [taskData, catData] = await Promise.all([
                    todoApi.getTaskById(id),
                    categoryApi.getCategories(),
                ]);
                setTask(taskData);
                setStatuses(catData.statuses.map((c) => c.name));
                setPriorities(catData.priorities.map((c) => c.name));
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load task");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [id]);

    const handleUpdate = async (payload: UpdateTaskPayload) => {
        if (!task) return;
        setIsSaving(true);
        try {
            const updated = await todoApi.updateTask(task._id, payload);
            setTask(updated);
            setEditOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!task) return;
        setIsDeleting(true);
        try {
            await todoApi.deleteTask(task._id);
            navigate("/my-task", { replace: true });
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) return <LoadingSpinner fullPage text="Loading task..." />;
    if (error || !task)
        return (
            <ErrorState
                message={error ?? "Task not found"}
                onRetry={() => navigate("/my-task")}
            />
        );

    return (
        <div className="animate-fade-in min-h-full">
            {/* Page container */}
            <div className="max-w-3xl mx-auto bg-[var(--color-app-surface)] rounded-2xl border border-[var(--color-app-border)] shadow-sm overflow-hidden">

                {/* ── Top bar ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-app-border)]">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </button>
                </div>

                {/* ── Header: image + title/meta ── */}
                <div className="flex items-start gap-5 p-6 pb-0">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden bg-gray-100 border border-[var(--color-app-border)]">
                        {task.image ? (
                            <img
                                src={task.image}
                                alt={task.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl select-none">
                                📋
                            </div>
                        )}
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0 pt-1">
                        <h1 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                            {task.title}
                        </h1>
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500">
                                Priority:{" "}
                                <span className={`font-semibold ${getPriorityClass(task.priority)}`}>
                                    {task.priority}
                                </span>
                            </p>
                            <p className="text-xs text-gray-500">
                                Status:{" "}
                                <span className={`font-semibold ${getStatusClass(task.status)}`}>
                                    {task.status}
                                </span>
                            </p>
                            {task.createdAt && (
                                <p className="text-xs text-gray-400">
                                    Created on: {formatDate(task.createdAt)}
                                </p>
                            )}
                            {task.date && (
                                <p className="text-xs text-gray-400">
                                    Due: {formatDate(task.date)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Description ── */}
                <div className="px-6 py-6">
                    {task.description ? (
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {task.description}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">No description provided.</p>
                    )}
                </div>

                {/* ── Bottom action bar ── */}
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--color-app-border)]">
                    <button
                        onClick={() => setDeleteOpen(true)}
                        className="w-9 h-9 rounded-xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all shadow-sm"
                        aria-label="Delete task"
                        title="Delete task"
                    >
                        <Trash2 size={15} />
                    </button>
                    <button
                        onClick={() => setEditOpen(true)}
                        className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[var(--color-primary-hover)] active:scale-95 transition-all shadow-sm"
                        aria-label="Edit task"
                        title="Edit task"
                    >
                        <Edit size={15} />
                    </button>
                </div>
            </div>

            {/* Edit Modal */}
            <TaskFormModal
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                onSubmit={handleUpdate}
                initialData={task}
                isLoading={isSaving}
                statuses={statuses}
                priorities={priorities}
            />

            {/* Delete Confirm */}
            <ConfirmDialog
                isOpen={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Task"
                message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                isLoading={isDeleting}
                variant="danger"
            />
        </div>
    );
};

export default TaskDetailPage;

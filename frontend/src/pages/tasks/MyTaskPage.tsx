import React, { useEffect, useState, useCallback } from "react";
import { todoApi } from "../../api/todo.api";
import { categoryApi } from "../../api/category.api";
import type { Task, CreateTaskPayload, UpdateTaskPayload, PaginationMeta } from "../../types";
import TaskCard from "../../components/todo/TaskCard";
import TaskFilterBar from "../../components/todo/TaskFilterBar";
import TaskFormModal from "../../components/todo/TaskFormModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import { useDisclosure } from "../../hooks/useUtils";
import { useDebounce } from "../../hooks/useUtils";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import TaskDetailPanel from "../../components/todo/TaskDetailPanel";

const PAGE_LIMIT = 6;

const MyTaskPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTask, setDeletingTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [statuses, setStatuses] = useState<string[]>([]);
    const [priorities, setPriorities] = useState<string[]>([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const debouncedSearch = useDebounce(search, 400);

    // Pagination
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);

    const addModal = useDisclosure();
    const editModal = useDisclosure();
    const deleteDialog = useDisclosure();

    const fetchCategories = useCallback(async () => {
        try {
            const res = await categoryApi.getCategories();
            setStatuses(res.statuses.map((c) => c.name));
            setPriorities(res.priorities.map((c) => c.name));
        } catch (err) {
            console.error("Failed to load categories", err);
        }
    }, []);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await todoApi.getTasks({
                search: debouncedSearch || undefined,
                status: statusFilter || undefined,
                priority: priorityFilter || undefined,
                page,
                limit: PAGE_LIMIT,
            });
            setTasks(res.tasks);
            setMeta(res.meta);
            setSelectedTask((prev) => {
                if (!prev) return prev;
                return res.tasks.find((t) => t._id === prev._id) || null;
            });
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load tasks",
            );
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, statusFilter, priorityFilter, page]);

    // Reset to page 1 when filters/search change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter, priorityFilter]);

    useEffect(() => {
        fetchTasks();
        fetchCategories();
    }, [fetchTasks, fetchCategories]);

    const handleCreateTask = async (payload: CreateTaskPayload) => {
        setIsSaving(true);
        try {
            await todoApi.createTask(payload);
            addModal.close();
            setPage(1);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateTask = async (payload: UpdateTaskPayload) => {
        if (!editingTask) return;
        setIsSaving(true);
        try {
            const updated = await todoApi.updateTask(editingTask._id, payload);
            setTasks((prev) =>
                prev.map((t) => (t._id === updated._id ? updated : t)),
            );
            if (selectedTask?._id === updated._id) setSelectedTask(updated);
            editModal.close();
            setEditingTask(null);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteTask = async () => {
        if (!deletingTask) return;
        setIsDeleting(true);
        try {
            await todoApi.deleteTask(deletingTask._id);
            if (selectedTask?._id === deletingTask._id) setSelectedTask(null);
            deleteDialog.close();
            setDeletingTask(null);
            // Go back a page if last item on current page was deleted
            if (tasks.length === 1 && page > 1) {
                setPage((p) => p - 1);
            } else {
                fetchTasks();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    const totalPages = meta?.totalPages ?? 1;

    const renderPageButtons = (): (number | "...")[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages: (number | "...")[] = [1];
        if (page > 3) pages.push("...");
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            pages.push(i);
        }
        if (page < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">My Tasks</h2>
                <Button
                    size="sm"
                    leftIcon={<Plus size={14} />}
                    onClick={addModal.open}
                >
                    Add Task
                </Button>
            </div>

            <TaskFilterBar
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
                statuses={statuses}
                priorities={priorities}
            />

            <div className="flex gap-5">
                {/* Task list */}
                <div className="flex-1 min-w-0">
                    {isLoading ? (
                        <LoadingSpinner
                            className="py-16"
                            text="Loading tasks..."
                        />
                    ) : error ? (
                        <ErrorState message={error} onRetry={fetchTasks} />
                    ) : tasks.length === 0 ? (
                        <EmptyState
                            title={
                                search || statusFilter || priorityFilter
                                    ? "No matching tasks"
                                    : "No tasks yet"
                            }
                            description={
                                search || statusFilter || priorityFilter
                                    ? "Try adjusting your filters."
                                    : "Add your first task to get started."
                            }
                            actionLabel={
                                !search && !statusFilter && !priorityFilter
                                    ? "Add Task"
                                    : undefined
                            }
                            onAction={addModal.open}
                        />
                    ) : (
                        <>
                            <div className="space-y-3">
                                {tasks.map((task) => (
                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        onClick={() => setSelectedTask(task)}
                                        onEdit={() => {
                                            setEditingTask(task);
                                            editModal.open();
                                        }}
                                        onDelete={() => {
                                            setDeletingTask(task);
                                            deleteDialog.open();
                                        }}
                                        className={
                                            selectedTask?._id === task._id
                                                ? "ring-2 ring-[var(--color-primary)]"
                                                : ""
                                        }
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-400">
                                        Page {page} / {totalPages}
                                        {meta && (
                                            <span className="ml-1">
                                                · {meta.total} task{meta.total !== 1 ? "s" : ""}
                                            </span>
                                        )}
                                    </p>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                            aria-label="Previous page"
                                        >
                                            <ChevronLeft size={14} />
                                        </button>

                                        {renderPageButtons().map((p, idx) =>
                                            p === "..." ? (
                                                <span
                                                    key={`ellipsis-${idx}`}
                                                    className="w-8 h-8 flex items-center justify-center text-xs text-gray-400 select-none"
                                                >
                                                    …
                                                </span>
                                            ) : (
                                                <button
                                                    key={p}
                                                    onClick={() => setPage(p as number)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                                                        page === p
                                                            ? "bg-[var(--color-primary)] text-white shadow-sm"
                                                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            ),
                                        )}

                                        <button
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                            aria-label="Next page"
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Task detail panel */}
                {selectedTask && (
                    <div className="w-96 flex-shrink-0">
                        <TaskDetailPanel
                            task={selectedTask}
                            onEdit={() => {
                                setEditingTask(selectedTask);
                                editModal.open();
                            }}
                            onDelete={() => {
                                setDeletingTask(selectedTask);
                                deleteDialog.open();
                            }}
                            onClose={() => setSelectedTask(null)}
                        />
                    </div>
                )}
            </div>

            {/* Add Task Modal */}
            <TaskFormModal
                isOpen={addModal.isOpen}
                onClose={addModal.close}
                onSubmit={
                    handleCreateTask as (
                        payload: import("../../types").CreateTaskPayload,
                    ) => Promise<void>
                }
                isLoading={isSaving}
                statuses={statuses}
                priorities={priorities}
            />

            {/* Edit Task Modal */}
            <TaskFormModal
                isOpen={editModal.isOpen}
                onClose={() => {
                    editModal.close();
                    setEditingTask(null);
                }}
                onSubmit={handleUpdateTask}
                initialData={editingTask}
                isLoading={isSaving}
                statuses={statuses}
                priorities={priorities}
            />

            {/* Delete Confirm */}
            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => {
                    deleteDialog.close();
                    setDeletingTask(null);
                }}
                onConfirm={handleDeleteTask}
                title="Delete Task"
                message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                isLoading={isDeleting}
                variant="danger"
            />
        </div>
    );
};

export default MyTaskPage;

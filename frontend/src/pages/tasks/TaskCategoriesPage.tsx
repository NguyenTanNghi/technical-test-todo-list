import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import { categoryApi } from "../../api/category.api";
import type { Category, CategoryType } from "../../types";

type EditableCategory = {
    id: string;
    type: CategoryType;
    name: string;
};

type PendingDelete = EditableCategory | null;

const TaskCategoriesPage: React.FC = () => {
    const navigate = useNavigate();

    const [statuses, setStatuses] = useState<Category[]>([]);
    const [priorities, setPriorities] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddType, setShowAddType] = useState<CategoryType | null>(null);
    const [newStatus, setNewStatus] = useState("");
    const [newPriority, setNewPriority] = useState("");
    const [editingCategory, setEditingCategory] =
        useState<EditableCategory | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<PendingDelete>(null);

    const valuesByType = useMemo(
        () => ({
            status: {
                items: statuses,
                newValue: newStatus,
                setNewValue: setNewStatus,
                placeholder: "New status name...",
                sectionTitle: "Task Status",
                addLabel: "Add Task Status",
            },
            priority: {
                items: priorities,
                newValue: newPriority,
                setNewValue: setNewPriority,
                placeholder: "New priority name...",
                sectionTitle: "Task Priority",
                addLabel: "Add New Priority",
            },
        }),
        [newPriority, newStatus, priorities, statuses],
    );

    const loadCategories = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await categoryApi.getCategories();
            setStatuses(response.statuses);
            setPriorities(response.priorities);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load categories",
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleAdd = async (type: CategoryType) => {
        const source = valuesByType[type];
        const value = source.newValue.trim();
        if (!value) return;

        setIsSubmitting(true);
        setError("");
        try {
            await categoryApi.createCategory({ type, name: value });
            source.setNewValue("");
            setShowAddType(null);
            await loadCategories();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create category",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingCategory) return;

        const trimmedName = editingCategory.name.trim();
        if (!trimmedName) return;

        setIsSubmitting(true);
        setError("");
        try {
            await categoryApi.updateCategory(editingCategory.id, {
                name: trimmedName,
            });
            setEditingCategory(null);
            await loadCategories();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update category",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;

        setIsSubmitting(true);
        setError("");
        try {
            await categoryApi.deleteCategory(deleteTarget.id);
            setDeleteTarget(null);
            await loadCategories();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete category",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const TableRow = ({ sn, category }: { sn: number; category: Category }) => (
        <tr className="border-b border-gray-100 last:border-0">
            <td className="py-3 px-4 text-sm text-gray-500 w-16">{sn}</td>
            <td className="py-3 px-4 text-sm text-gray-800 text-center">
                {editingCategory?.id === category._id ? (
                    <input
                        value={editingCategory.name}
                        onChange={(e) =>
                            setEditingCategory((prev) =>
                                prev ? { ...prev, name: e.target.value } : prev,
                            )
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                        autoFocus
                    />
                ) : (
                    category.name
                )}
            </td>
            <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-center gap-2">
                    {editingCategory?.id === category._id ? (
                        <>
                            <button
                                onClick={handleSaveEdit}
                                className="px-3 py-1.5 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600"
                                disabled={isSubmitting}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditingCategory(null)}
                                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() =>
                                    setEditingCategory({
                                        id: category._id,
                                        type: category.type,
                                        name: category.name,
                                    })
                                }
                                className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-primary)] text-white rounded text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                            >
                                <Edit2 size={12} /> Edit
                            </button>
                            <button
                                onClick={() =>
                                    setDeleteTarget({
                                        id: category._id,
                                        type: category.type,
                                        name: category.name,
                                    })
                                }
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors"
                            >
                                <Trash2 size={12} /> Delete
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );

    return (
        <div className="animate-fade-in w-full max-w-none">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[var(--color-app-text)] border-b-2 border-[var(--color-primary)] pb-1">
                    Task Categories
                </h2>
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-[var(--color-app-text-muted)] hover:text-[var(--color-app-text)] font-medium"
                >
                    Go Back
                </button>
            </div>

            <Button
                size="sm"
                className="mb-6"
                leftIcon={<Plus size={14} />}
                onClick={() => setShowAddType("status")}
            >
                Add Category
            </Button>

            {error && (
                <div className="mb-6">
                    <ErrorState message={error} onRetry={loadCategories} />
                </div>
            )}

            {isLoading ? (
                <LoadingSpinner
                    className="py-20"
                    text="Loading categories..."
                />
            ) : (
                <>
                    {/* Task Status Table */}
                    <div className="bg-[var(--color-app-surface)] rounded-2xl border border-[var(--color-app-border)] shadow-sm mb-6 overflow-hidden">
                        <div className="flex items-center justify-between px-5 pt-5 pb-3">
                            <h3 className="text-sm font-semibold text-[var(--color-app-text)]">
                                {valuesByType.status.sectionTitle}
                            </h3>
                            <button
                                onClick={() => setShowAddType("status")}
                                className="text-xs text-[var(--color-primary)] flex items-center gap-1 hover:underline"
                            >
                                <Plus size={12} />{" "}
                                {valuesByType.status.addLabel}
                            </button>
                        </div>

                        {showAddType === "status" && (
                            <div className="mx-5 mb-3 flex gap-2">
                                <input
                                    value={newStatus}
                                    onChange={(e) =>
                                        setNewStatus(e.target.value)
                                    }
                                    placeholder={
                                        valuesByType.status.placeholder
                                    }
                                    className="flex-1 border border-[var(--color-app-border)] rounded-lg px-3 py-1.5 text-sm bg-[var(--color-app-surface-soft)] text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-primary)]"
                                    autoFocus
                                />
                                <button
                                    onClick={() => handleAdd("status")}
                                    disabled={isSubmitting}
                                    className="px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-sm hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddType(null);
                                        setNewStatus("");
                                    }}
                                    className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        <table className="w-full">
                            <thead>
                                <tr className="border-y border-[var(--color-app-border)] bg-[var(--color-app-surface-soft)]">
                                    <th className="py-2.5 px-4 text-left text-xs font-medium text-[var(--color-app-text-muted)] w-16">
                                        SN
                                    </th>
                                    <th className="py-2.5 px-4 text-center text-xs font-medium text-[var(--color-app-text-muted)]">
                                        Task Status
                                    </th>
                                    <th className="py-2.5 px-4 text-center text-xs font-medium text-[var(--color-app-text-muted)]">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {statuses.map((category, index) => (
                                    <TableRow
                                        key={category._id}
                                        sn={index + 1}
                                        category={category}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Task Priority Table */}
                    <div className="bg-[var(--color-app-surface)] rounded-2xl border border-[var(--color-app-border)] shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 pt-5 pb-3">
                            <h3 className="text-sm font-semibold text-[var(--color-app-text)]">
                                {valuesByType.priority.sectionTitle}
                            </h3>
                            <button
                                onClick={() => setShowAddType("priority")}
                                className="text-xs text-[var(--color-primary)] flex items-center gap-1 hover:underline"
                            >
                                <Plus size={12} />{" "}
                                {valuesByType.priority.addLabel}
                            </button>
                        </div>

                        {showAddType === "priority" && (
                            <div className="mx-5 mb-3 flex gap-2">
                                <input
                                    value={newPriority}
                                    onChange={(e) =>
                                        setNewPriority(e.target.value)
                                    }
                                    placeholder={
                                        valuesByType.priority.placeholder
                                    }
                                    className="flex-1 border border-[var(--color-app-border)] rounded-lg px-3 py-1.5 text-sm bg-[var(--color-app-surface-soft)] text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-primary)]"
                                    autoFocus
                                />
                                <button
                                    onClick={() => handleAdd("priority")}
                                    disabled={isSubmitting}
                                    className="px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-sm hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddType(null);
                                        setNewPriority("");
                                    }}
                                    className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        <table className="w-full">
                            <thead>
                                <tr className="border-y border-[var(--color-app-border)] bg-[var(--color-app-surface-soft)]">
                                    <th className="py-2.5 px-4 text-left text-xs font-medium text-[var(--color-app-text-muted)] w-16">
                                        SN
                                    </th>
                                    <th className="py-2.5 px-4 text-center text-xs font-medium text-[var(--color-app-text-muted)]">
                                        Task Priority
                                    </th>
                                    <th className="py-2.5 px-4 text-center text-xs font-medium text-[var(--color-app-text-muted)]">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {priorities.map((category, index) => (
                                    <TableRow
                                        key={category._id}
                                        sn={index + 1}
                                        category={category}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Category"
                message={`Are you sure you want to delete ${deleteTarget?.name || "this category"}?`}
                confirmLabel="Delete"
                isLoading={isSubmitting}
            />
        </div>
    );
};

export default TaskCategoriesPage;

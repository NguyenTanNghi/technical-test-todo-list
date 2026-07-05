import React from "react";
import { Edit, Trash2, AlertTriangle, X, Circle } from "lucide-react";
import type { Task } from "../../types";
import { formatDate, getPriorityClass, getStatusClass } from "../../utils";

interface TaskDetailPanelProps {
    task: Task;
    onEdit?: () => void;
    onDelete?: () => void;
    onClose?: () => void;
}

const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({
    task,
    onEdit,
    onDelete,
    onClose,
}) => {
    return (
        <div className="bg-[var(--color-app-surface)] rounded-2xl border border-[var(--color-app-border)] shadow-sm overflow-hidden animate-slide-in">
            {/* Header image or icon */}
            <div className="relative">
                {task.image ? (
                    <img
                        src={task.image}
                        alt={task.title}
                        className="w-full h-36 object-cover"
                    />
                ) : (
                    <div className="w-full h-24 bg-gradient-to-br from-[var(--color-app-surface-soft)] to-[var(--color-app-bg)] flex items-center justify-center">
                        <Circle
                            size={40}
                            className="text-[var(--color-primary-soft-strong)]"
                        />
                    </div>
                )}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                        aria-label="Close"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            <div className="p-5">
                {/* Title & meta */}
                <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-base font-bold text-gray-900 leading-snug">
                        {task.title}
                    </h3>
                </div>

                <div className="space-y-1 mb-4">
                    <p className="text-xs text-gray-500">
                        Priority:{" "}
                        <span
                            className={`font-semibold ${getPriorityClass(task.priority)}`}
                        >
                            {task.priority}
                        </span>
                    </p>
                    <p className="text-xs text-gray-500">
                        Status:{" "}
                        <span
                            className={`font-semibold ${getStatusClass(task.status)}`}
                        >
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

                {/* Description */}
                {task.description && (
                    <div className="text-sm text-gray-700 leading-relaxed mb-5 whitespace-pre-wrap">
                        {task.description}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-app-border)]">
                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                            aria-label="Delete task"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[var(--color-primary-hover)] transition-colors"
                            aria-label="Edit task"
                        >
                            <Edit size={14} />
                        </button>
                    )}
                    <button
                        className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[var(--color-primary-hover)] transition-colors"
                        aria-label="Flag task"
                    >
                        <AlertTriangle size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailPanel;

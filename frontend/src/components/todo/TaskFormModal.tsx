import React, { useState, useRef } from "react";
import { ImagePlus } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import DatePicker from "../common/DatePicker";
import type { CreateTaskPayload, TaskPriority, Task } from "../../types";

interface TaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: CreateTaskPayload) => Promise<void>;
    initialData?: Task | null;
    title?: string;
    isLoading?: boolean;
    statuses?: string[];
    priorities?: string[];
}

const defaultStatuses = ["Not Started", "In Progress", "Completed"];
const defaultPriorities = ["Extreme", "Moderate", "Low"];

const getPriorityColor = (name: string): string => {
    const p = (name || '').toLowerCase();
    if (p.includes('extreme') || p.includes('high') || p.includes('urgent') || p.includes('critical')) return '#ef4444';
    if (p.includes('moderate') || p.includes('medium') || p.includes('normal')) return '#3b82f6';
    if (p.includes('low') || p.includes('easy')) return '#22c55e';
    return '#6b7280';
};

const getStatusColor = (name: string): string => {
    const s = (name || '').toLowerCase();
    if (s.includes('complete') || s.includes('done') || s.includes('finish') || s.includes('hoàn thành')) return '#22c55e';
    if (s.includes('progress') || s.includes('active') || s.includes('doing') || s.includes('tiến hành')) return '#3b82f6';
    if (s.includes('not') || s.includes('todo') || s.includes('start') || s.includes('pending') || s.includes('chưa')) return '#ef4444';
    return '#6b7280';
};

const TaskFormModal: React.FC<TaskFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    title,
    isLoading = false,
    statuses = defaultStatuses,
    priorities = defaultPriorities,
}) => {
    const isEditing = !!initialData;
    const modalTitle = title || (isEditing ? "Edit Task" : "Add New Task");

    const [formData, setFormData] = useState<{
        title: string;
        date: string;
        priority: string;
        status: string;
        description: string;
    }>({
        title: initialData?.title || "",
        date: initialData?.date ? initialData.date.slice(0, 10) : "",
        priority: initialData?.priority || priorities[0] || "Moderate",
        status: initialData?.status || statuses[0] || "Not Started",
        description: initialData?.description || "",
    });

    const [imagePreview, setImagePreview] = useState<string>(
        initialData?.image || "",
    );
    const [dragOver, setDragOver] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) handleImageChange(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload: CreateTaskPayload = {
            title: formData.title.trim(),
            description: formData.description.trim() || undefined,
            priority: formData.priority as any,
            status: formData.status as any,
            date: formData.date || undefined,
            image: imagePreview || undefined,
        };

        await onSubmit(payload);
    };

    // Reset when opened
    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                title: initialData?.title || "",
                date: initialData?.date ? initialData.date.slice(0, 10) : "",
                priority: initialData?.priority || priorities[0] || "Moderate",
                status: initialData?.status || statuses[0] || "Not Started",
                description: initialData?.description || "",
            });
            setImagePreview(initialData?.image || "");
            setErrors({});
        }
    }, [isOpen, initialData, priorities, statuses]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="lg"
            showCloseButton={false}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900 border-b-2 border-[var(--color-primary)] pb-1">
                    {modalTitle}
                </h2>
                <button
                    onClick={onClose}
                    className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
                >
                    Go Back
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData((p) => ({
                                ...p,
                                title: e.target.value,
                            }))
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
                    />
                    {errors.title && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.title}
                        </p>
                    )}
                </div>

                {/* Date */}
                <div>
                    <DatePicker
                        label="Date"
                        value={formData.date}
                        onChange={(date) =>
                            setFormData((p) => ({
                                ...p,
                                date,
                            }))
                        }
                        placeholder="Select due date"
                    />
                </div>

                {/* Priority */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                    </label>
                    <div className="flex items-center gap-6">
                        {priorities.map((p) => (
                            <label
                                key={p}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor: getPriorityColor(p),
                                    }}
                                />
                                <span className="text-sm text-gray-700">
                                    {p}
                                </span>
                                <input
                                    type="radio"
                                    name="priority"
                                    value={p}
                                    checked={formData.priority === p}
                                    onChange={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            priority: p,
                                        }))
                                    }
                                    className="w-4 h-4 accent-[var(--color-primary)]"
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <div className="flex flex-wrap items-center gap-6">
                        {statuses.map((s) => (
                            <label
                                key={s}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor: getStatusColor(s),
                                    }}
                                />
                                <span className="text-sm text-gray-700">
                                    {s}
                                </span>
                                <input
                                    type="radio"
                                    name="status"
                                    value={s}
                                    checked={formData.status === s}
                                    onChange={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            status: s,
                                        }))
                                    }
                                    className="w-4 h-4 accent-[var(--color-primary)]"
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Description & Image upload */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Task Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((p) => ({
                                    ...p,
                                    description: e.target.value,
                                }))
                            }
                            placeholder="Start writing here..."
                            rows={5}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
                        />
                    </div>

                    <div className="w-44">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Image
                        </label>
                        <div
                            className={`file-upload-area h-36 flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden ${dragOver ? "drag-over" : ""}`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <>
                                    <ImagePlus
                                        size={24}
                                        className="text-gray-400"
                                    />
                                    <p className="text-xs text-gray-400 text-center">
                                        Drag&Drop files here
                                    </p>
                                    <p className="text-xs text-gray-400">or</p>
                                    <button
                                        type="button"
                                        className="text-xs border border-gray-300 rounded px-2.5 py-1 text-gray-600 hover:bg-gray-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current?.click();
                                        }}
                                    >
                                        Browse
                                    </button>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageChange(file);
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="px-8"
                    >
                        Done
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default TaskFormModal;

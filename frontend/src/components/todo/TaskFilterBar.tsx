import React from "react";
import { Search, ChevronDown } from "lucide-react";
import type { TaskPriority, TaskStatus } from "../../types";

interface TaskFilterBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    priorityFilter: string;
    onPriorityChange: (value: string) => void;
}

const statuses: TaskStatus[] = ["Not Started", "In Progress", "Completed"];
const priorities: TaskPriority[] = ["Extreme", "Moderate", "Low"];

const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
    search,
    onSearchChange,
    statusFilter,
    onStatusChange,
    priorityFilter,
    onPriorityChange,
}) => {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-[var(--color-app-surface)]"
                />
            </div>

            {/* Status filter */}
            <div className="relative">
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-[var(--color-app-surface)] text-gray-700 cursor-pointer"
                >
                    <option value="">All Status</option>
                    {statuses.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
            </div>

            {/* Priority filter */}
            <div className="relative">
                <select
                    value={priorityFilter}
                    onChange={(e) => onPriorityChange(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-[var(--color-app-surface)] text-gray-700 cursor-pointer"
                >
                    <option value="">All Priority</option>
                    {priorities.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
            </div>
        </div>
    );
};

export default TaskFilterBar;

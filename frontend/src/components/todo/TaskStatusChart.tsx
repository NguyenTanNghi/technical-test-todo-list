import React from "react";
import type { TaskStats } from "../../types";

interface DonutChartProps {
    percent: number;
    color: string;
    size?: number;
    strokeWidth?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({
    percent,
    color,
    size = 90,
    strokeWidth = 8,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div
            className="relative inline-flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            <svg
                width={size}
                height={size}
                style={{ transform: "rotate(-90deg)" }}
            >
                {/* Background track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--color-app-border)"
                    strokeWidth={strokeWidth}
                />
                {/* Progress arc */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                />
            </svg>
            <span className="absolute text-sm font-bold text-gray-800">
                {percent}%
            </span>
        </div>
    );
};

interface TaskStatusChartProps {
    stats: TaskStats;
}

const TaskStatusChart: React.FC<TaskStatusChartProps> = ({ stats }) => {
    return (
        <div className="bg-[var(--color-app-surface)] rounded-2xl border border-[var(--color-app-border)] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <polyline
                            points="1,6 4,9 11,2"
                            stroke="var(--color-primary)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <h3 className="text-sm font-semibold text-[var(--color-primary)]">
                    Task Status
                </h3>
            </div>

            <div className="flex items-center justify-around">
                <div className="flex flex-col items-center gap-2">
                    <DonutChart
                        percent={stats.completedPercent}
                        color="#22c55e"
                    />
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs text-gray-600">Completed</span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <DonutChart
                        percent={stats.inProgressPercent}
                        color="#3b82f6"
                    />
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-xs text-gray-600">
                            In Progress
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <DonutChart
                        percent={stats.notStartedPercent}
                        color="#ef4444"
                    />
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-xs text-gray-600">
                            Not Started
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { DonutChart };
export default TaskStatusChart;

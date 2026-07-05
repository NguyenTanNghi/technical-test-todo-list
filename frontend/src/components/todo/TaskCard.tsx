import React from 'react';
import { MoreHorizontal, Circle } from 'lucide-react';
import type { Task } from '../../types';
import { formatDateShort, getPriorityClass, getStatusClass, truncateText } from '../../utils';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  onEdit,
  onDelete,
  className = '',
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div
      className={`task-card bg-white rounded-xl border border-gray-100 shadow-sm p-4 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Status indicator */}
        <div className="mt-0.5 flex-shrink-0">
          <Circle
            size={16}
            className={
              task.status === 'Completed'
                ? 'text-green-500 fill-green-500'
                : task.status === 'In Progress'
                ? 'text-blue-500'
                : 'text-red-400'
            }
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-gray-500 leading-relaxed mb-2">
              {truncateText(task.description, 100)}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span>
              Priority:{' '}
              <span className={`font-medium ${getPriorityClass(task.priority)}`}>
                {task.priority}
              </span>
            </span>
            <span className="text-gray-300">•</span>
            <span>
              Status:{' '}
              <span className={`font-medium ${getStatusClass(task.status)}`}>
                {task.status}
              </span>
            </span>
            {task.createdAt && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-gray-400">
                  Created on: {formatDateShort(task.createdAt)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Task image */}
        {task.image && (
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
            <img
              src={task.image}
              alt={task.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Menu */}
        <div ref={menuRef} className="relative flex-shrink-0" onClick={e => e.stopPropagation()}>
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Task options"
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-7 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[120px] animate-fade-in">
              {onEdit && (
                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => { onEdit(); setMenuOpen(false); }}
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  onClick={() => { onDelete(); setMenuOpen(false); }}
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

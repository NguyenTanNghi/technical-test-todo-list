import React from 'react';
import { ClipboardList } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No tasks found',
  description = 'Get started by adding your first task.',
  actionLabel,
  onAction,
  className = '',
  icon,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 py-12 ${className}`}>
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        {icon || <ClipboardList size={32} className="text-gray-400" />}
      </div>
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 max-w-xs">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

import type { TaskPriority, TaskStatus, TaskStats } from '../types';

/**
 * Format a date string to display format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Format date to short form (e.g., 20 June)
 */
export const formatDateShort = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  });
};

/**
 * Get today's date display string (e.g., Tuesday 20/06/2023)
 */
export const getTodayDisplay = (): { day: string; date: string } => {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' });
  const date = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return { day, date };
};

/**
 * Get CSS class for task priority
 */
export const getPriorityClass = (priority: TaskPriority): string => {
  const map: Record<TaskPriority, string> = {
    Extreme: 'priority-extreme',
    Moderate: 'priority-moderate',
    Low: 'priority-low',
  };
  return map[priority] || '';
};

/**
 * Get CSS class for task status
 */
export const getStatusClass = (status: TaskStatus): string => {
  const map: Record<TaskStatus, string> = {
    Completed: 'status-completed',
    'In Progress': 'status-in-progress',
    'Not Started': 'status-not-started',
  };
  return map[status] || '';
};

/**
 * Calculate task statistics from task array
 */
export const calculateTaskStats = (tasks: { status: TaskStatus }[]): TaskStats => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const notStarted = tasks.filter(t => t.status === 'Not Started').length;

  return {
    total,
    completed,
    inProgress,
    notStarted,
    completedPercent: total ? Math.round((completed / total) * 100) : 0,
    inProgressPercent: total ? Math.round((inProgress / total) * 100) : 0,
    notStartedPercent: total ? Math.round((notStarted / total) * 100) : 0,
  };
};

/**
 * Truncate text to a given length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get initials from a name
 */
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Check if a string is a valid URL
 */
export const isValidUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

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
export const getPriorityClass = (priority: string): string => {
  const p = (priority || '').toLowerCase();
  if (p.includes('extreme') || p.includes('high') || p.includes('urgent') || p.includes('critical')) return 'priority-extreme';
  if (p.includes('moderate') || p.includes('medium') || p.includes('normal')) return 'priority-moderate';
  if (p.includes('low') || p.includes('easy')) return 'priority-low';
  return 'priority-moderate'; // fallback
};

/**
 * Get CSS class for task status
 */
export const getStatusClass = (status: string): string => {
  const s = (status || '').toLowerCase();
  if (s.includes('complete') || s.includes('done') || s.includes('finish') || s.includes('hoàn thành')) return 'status-completed';
  if (s.includes('progress') || s.includes('active') || s.includes('doing') || s.includes('tiến hành')) return 'status-in-progress';
  if (s.includes('not') || s.includes('todo') || s.includes('start') || s.includes('pending') || s.includes('chưa')) return 'status-not-started';
  return 'status-not-started'; // fallback
};

/**
 * Calculate task statistics from task array
 */
export const calculateTaskStats = (tasks: { status: string }[]): TaskStats => {
  const total = tasks.length;
  const completed = tasks.filter(t => {
    const s = (t.status || '').toLowerCase();
    return s.includes('complete') || s.includes('done') || s.includes('finish') || s.includes('hoàn thành');
  }).length;
  const inProgress = tasks.filter(t => {
    const s = (t.status || '').toLowerCase();
    return s.includes('progress') || s.includes('active') || s.includes('doing') || s.includes('tiến hành');
  }).length;
  const notStarted = total - completed - inProgress;

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

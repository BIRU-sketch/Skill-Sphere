import { format, formatDistanceToNow, isAfter, isBefore } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

/**
 * Convert Firestore Timestamp to Date
 */
export function timestampToDate(timestamp: Timestamp): Date {
  return timestamp.toDate();
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | Timestamp, formatStr: string = 'PPP'): string {
  const dateObj = date instanceof Timestamp ? timestampToDate(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date | Timestamp): string {
  const dateObj = date instanceof Timestamp ? timestampToDate(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Check if a deadline has passed
 */
export function isDeadlinePassed(deadline: Date | Timestamp): boolean {
  const now = new Date();
  const deadlineDate = deadline instanceof Timestamp ? timestampToDate(deadline) : deadline;
  return isAfter(now, deadlineDate);
}

/**
 * Check if a deadline is upcoming (within 7 days)
 */
export function isDeadlineUpcoming(deadline: Date | Timestamp): boolean {
  const now = new Date();
  const deadlineDate = deadline instanceof Timestamp ? timestampToDate(deadline) : deadline;
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return isAfter(deadlineDate, now) && isBefore(deadlineDate, sevenDaysFromNow);
}


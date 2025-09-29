import { queues, QUEUE_NAMES } from './queue';

// Email queue helpers
export const addEmailJob = async (data: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}, options?: { delay?: number; priority?: number }) => {
  return queues[QUEUE_NAMES.EMAIL].add('send_email', data, {
    delay: options?.delay,
    priority: options?.priority,
  });
};

// Notification queue helpers
export const addNotificationJob = async (data: {
  userId: string;
  type: 'email' | 'push' | 'sms';
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}, options?: { delay?: number; priority?: number }) => {
  return queues[QUEUE_NAMES.NOTIFICATION].add('send_notification', data, {
    delay: options?.delay,
    priority: options?.priority,
  });
};

// Background task queue helpers
export const addBackgroundTaskJob = async (data: {
  taskName: string;
  payload: Record<string, unknown>;
  priority?: 'low' | 'medium' | 'high';
}, options?: { delay?: number; priority?: number }) => {
  return queues[QUEUE_NAMES.BACKGROUND_TASK].add('execute_task', data, {
    delay: options?.delay,
    priority: options?.priority,
  });
};

// Scheduled jobs
export const scheduleEmailJob = async (data: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}, delayMs: number) => {
  return addEmailJob(data, { delay: delayMs });
};

export const scheduleNotificationJob = async (data: {
  userId: string;
  type: 'email' | 'push' | 'sms';
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}, delayMs: number) => {
  return addNotificationJob(data, { delay: delayMs });
};

export const scheduleBackgroundTaskJob = async (data: {
  taskName: string;
  payload: Record<string, unknown>;
  priority?: 'low' | 'medium' | 'high';
}, delayMs: number) => {
  return addBackgroundTaskJob(data, { delay: delayMs });
};

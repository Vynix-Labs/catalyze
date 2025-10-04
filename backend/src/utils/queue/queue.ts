import { Queue, Worker } from 'bullmq';
import { redis } from '../../config/redis';

// Worker processors
import { emailProcessor } from './processors/email';
import { notificationProcessor } from './processors/notification';
import { backgroundTaskProcessor } from './processors/background_task';

// Queue names
export const QUEUE_NAMES = {
  EMAIL: 'email',
  NOTIFICATION: 'notification',
  BACKGROUND_TASK: 'background_task',
} as const;

// Queue configurations
export const queues = {
  [QUEUE_NAMES.EMAIL]: new Queue(QUEUE_NAMES.EMAIL, {
    connection: redis,
    defaultJobOptions: {
      removeOnComplete: 50,
      removeOnFail: 20,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    },
  }),

  [QUEUE_NAMES.NOTIFICATION]: new Queue(QUEUE_NAMES.NOTIFICATION, {
    connection: redis,
    defaultJobOptions: {
      removeOnComplete: 100,
      removeOnFail: 20,
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
  }),

  [QUEUE_NAMES.BACKGROUND_TASK]: new Queue(QUEUE_NAMES.BACKGROUND_TASK, {
    connection: redis,
    defaultJobOptions: {
      removeOnComplete: 10,
      removeOnFail: 1,
      attempts: 1,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    },
  }),
};

export const workers = {
  [QUEUE_NAMES.EMAIL]: new Worker(QUEUE_NAMES.EMAIL, emailProcessor, {
    connection: redis,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000,
    },
  }),

  [QUEUE_NAMES.NOTIFICATION]: new Worker(QUEUE_NAMES.NOTIFICATION, notificationProcessor, {
    connection: redis,
    concurrency: 3,
  }),

  [QUEUE_NAMES.BACKGROUND_TASK]: new Worker(QUEUE_NAMES.BACKGROUND_TASK, backgroundTaskProcessor, {
    connection: redis,
    concurrency: 1,
  }),
};

// Basic worker event logging for visibility and debugging
for (const [name, worker] of Object.entries(workers)) {
  worker.on('completed', (job) => {
    console.log(`[worker:${name}] job completed`, { id: job.id, name: job.name });
  });
  worker.on('failed', (job, err) => {
    console.error(`[worker:${name}] job failed`, { id: job?.id, name: job?.name, err });
  });
  worker.on('error', (err) => {
    console.error(`[worker:${name}] worker error`, err);
  });
}

// Expose an explicit closer to be called from Fastify onClose hook
export async function closeQueuesAndWorkers() {
  console.log('Closing BullMQ queues and workers...');
  await Promise.all([
    ...Object.values(queues).map((q) => q.close()),
    ...Object.values(workers).map((w) => w.close()),
  ]);
  console.log('Queues and workers shut down gracefully');
}

export default queues;

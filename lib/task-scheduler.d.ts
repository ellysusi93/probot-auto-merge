import PQueue from 'p-queue';
declare type TaskWorker<TTask> = (task: TTask) => Promise<void>;
/**
 * A task scheduler that holds multiple named queues. The tasks in each queue are handled
 * one after the other. However, tasks in general (across queues) are handled concurrently.
 */
export declare class TaskScheduler<TTask> {
    worker: TaskWorker<TTask>;
    workerQueue: PQueue;
    queues: {
        [key: string]: TTask[];
    };
    /**
     * Creates a TaskScheduler that handles tasks using the specified worker.
     */
    constructor(opts: {
        worker: TaskWorker<TTask>;
        concurrency?: number;
    });
    onIdle(): Promise<void>;
    stop(): void;
    /**
     * Queue a task onto the queue with queueName
     */
    queue(queueName: string, task: TTask): void;
    hasQueued(queueName: string): boolean;
    private doWorkForKey;
    private queueWorkForQueueName;
}
export {};

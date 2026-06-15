import { Worker } from "worker_threads";

interface Queue<T> {
  data: T;
  resolve: (value: T) => void;
  reject: (value: T) => void;
}

interface PoolWorker<T> extends Worker {
  busy: boolean;
  _resolve: (value: T) => void;
  _reject: (value: T) => void;
}

class WorkerPool<T> {
  private queue: Queue<T>[];
  private workers: PoolWorker<T>[];
  private MAX_QUEUE_SIZE: number = 4;

  constructor(workerScript: string, size: number, MAX_QUEUE_SIZE: number) {
    this.queue = [];
    this.workers = Array.from({ length: size }, () =>
      this._createWorker(workerScript),
    );
    this.MAX_QUEUE_SIZE = MAX_QUEUE_SIZE;
  }

  _createWorker(workerScript: string) {
    const worker = new Worker(workerScript, {
      execArgv: ["--import", "tsx"],
    }) as PoolWorker<T>;

    worker.busy = false;

    worker.on("message", (result) => {
      worker.busy = false;
      worker._resolve(result);
      this._next();
    });

    worker.on("error", (reason) => {
      worker.busy = false;
      worker._reject(reason as T);
      this._next();
    });

    return worker;
  }

  _next() {
    if (!this.queue.length) return;
    const idle = this.workers.find((w) => !w.busy);
    if (!idle) return;

    const { data, resolve, reject } = this.queue.shift();
    idle.busy = true;
    idle._resolve = resolve;
    idle._reject = reject;
    idle.postMessage(data);
  }

  run(data: T) {
    if (this.queue.length > this.MAX_QUEUE_SIZE) {
      return Promise.reject("503 Service Unavailable");
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ data, resolve, reject });
      this._next();
    });
  }

  terminate() {
    this.workers.forEach((w) => w.terminate());
  }
}

export default WorkerPool;

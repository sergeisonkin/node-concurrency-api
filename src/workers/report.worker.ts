import { workerData, parentPort } from 'worker_threads';


// "heavy" work pretender!!!
let result = 0;

for (let i = 0; i < workerData.user.id * 1_000_000; i++) {
  result += i;
}

parentPort?.postMessage(
  {
    "userId": workerData.user.id,
    result
  }
);
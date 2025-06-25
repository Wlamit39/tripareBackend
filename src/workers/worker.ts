// src/workers/worker.ts
import { Worker } from '@temporalio/worker';
import * as activities from '../workflows/activities';

async function run() {
  try {
    const worker = await Worker.create({
      workflowsPath: require.resolve('../workflows/hotelSearch.workflow'),
      activities,
      taskQueue: 'hotel-search',
    });

    console.log('👷 Worker started on task queue: hotel-search');
    await worker.run();
  } catch (err) {
    console.error('❌ Worker failed to start:', err);
    process.exit(1);
  }
}

run();

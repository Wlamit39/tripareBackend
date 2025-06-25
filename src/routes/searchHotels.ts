import express, { Request, Response } from 'express';
import { Connection, Client } from '@temporalio/client';
import { hotelSearchWorkflow } from '../workflows/hotelSearch.workflow';

const router = express.Router();

// ✅ FIX: Explicitly typed function declaration
async function searchHotelsHandler(req: Request, res: Response): Promise<void> {
  const { city, checkIn, checkOut } = req.body;

  if (!city || !checkIn || !checkOut) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const connection = await Connection.connect();
    const client = new Client({ connection });

    const response = await client.workflow.execute(hotelSearchWorkflow, {
      taskQueue: 'hotel-search',
      workflowId: `hotel-search-${Date.now()}`,
      args: [{ city, checkIn, checkOut }],
    });

    console.log(response, "response")

    if (!response) {
      res.status(500).json({ error: 'Workflow did not return a valid result' });
      return;
    }

    const { result, diagnostics } = response;

    if (!result) {
      res.status(404).json({ message: 'No hotels found', diagnostics });
    } else {
      res.json({ result, diagnostics });
    }
  } catch (err) {
    console.error('Workflow execution failed:', err);
    res.status(500).json({ error: 'Failed to process hotel search' });
  }
}

// ✅ FIX: Do not use arrow function here — use named function
router.post('/search-hotels', searchHotelsHandler);

export default router;

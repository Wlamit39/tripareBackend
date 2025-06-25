// src/suppliers/supplierA.ts
import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

router.get('/hotels', function (_req: Request, res: Response) {
  const delay = Math.random() * 6000;
  const shouldFail = Math.random() < 0.2;
  const shouldReturnEmpty = Math.random() < 0.2;

  setTimeout(() => {
    if (shouldFail) {
      return res.status(500).json({ error: 'Supplier A failed' });
    }

    if (shouldReturnEmpty) {
      return res.json([]);
    }

    return res.json([
      {
        hotelId: 'a1',
        name: 'Hotel Sunrise',
        price: 145.0,
      },
    ]);
  }, delay);
});

export default router;

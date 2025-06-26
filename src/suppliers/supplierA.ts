import express from 'express';

const router = express.Router();

const a_response = { hotelId: 'a1', name: 'Hotel Sunrise', price: 145.0 };

router.get('/hotels', function (req: express.Request, res: express.Response): void {
  const testCase = req.query.testCase;
  console.log(testCase, ">>>>>1a>>>>>")
  console.log('🔍 supplierA req.query:', JSON.stringify(req.query));

  if (testCase) {
    switch (testCase) {
      case 'A-cheaper':
        res.json([a_response]);
        return;
      case 'B-cheaper':
        res.json([]);
        return;
      case 'same-rate':
        console.log(testCase,">>>>>>same-rate")
        res.json([a_response]);
        return;
      case 'A-fails-B-succeeds':
        res.json([]);
        return;
      case 'both-fail':
        res.status(500).json({ error: 'Supplier A failed' });
        return;
      case 'A-empty-B-valid':
        res.json([]);
        return;
      case 'both-empty':
        res.json([]);
        return;
      default:
        res.status(400).json({ error: 'Unknown testCase' });
        return;
    }
  }

  const delay = Math.random() * 6000;
  const shouldFail = Math.random() < 0.2;
  const shouldReturnEmpty = Math.random() < 0.2;

  setTimeout(() => {
    if (shouldFail) {
      res.status(500).json({ error: 'Supplier A failed' });
    } else if (shouldReturnEmpty) {
      res.json([]);
    } else {
      res.json([a_response]);
    }
  }, delay);
});

export default router;

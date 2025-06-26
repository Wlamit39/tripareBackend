import express from 'express';

const router = express.Router();

const b_response = {"hotelId": "b1", "name": "Hotel Sunset", "price": 130};

router.get('/hotels', function (req: express.Request, res: express.Response): void {
  const testCase = req.query.testCase;
  console.log(testCase, ">>>>>1b>>>>>")

  if (testCase) {
    switch (testCase) {
      case 'A-cheaper':
        res.json([]);
        return;
      case 'B-cheaper':
        res.json([b_response]);
        return;
      case 'same-rate':
        res.json([]);
        return;
      case 'A-fails-B-succeeds':
        res.json([b_response]);
        return;
      case 'both-fail':
        res.status(500).json({ error: 'Supplier A failed' });
        return;
      case 'A-empty-B-valid':
        res.json([b_response]);
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
      res.json([b_response]);
    }
  }, delay);
});

export default router;
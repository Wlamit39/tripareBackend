import express from 'express';

const router = express.Router();

const a_responses = [
                    { hotelId: 'a1', name: 'Hotel Sunset1', price: 115.0, "city":"delhi"}, 
                    { hotelId: 'a2', name: 'Hotel Sunset2', price: 125.0, "city":"delhi"},
                    { hotelId: 'a3', name: 'Hotel Sunset3', price: 145.0, "city":"delhi"}
                  ];

router.get('/hotels', function (req: express.Request, res: express.Response): void {
  const testCase = req.query.testCase;
  const city = req.query.city;
  console.log('🔍 supplierA req.query:', JSON.stringify(req.query));

  if (testCase) {
    switch (testCase) {
      case 'A-cheaper':
        res.json([a_responses]);
        return;
      case 'B-cheaper':
        res.json([]);
        return;
      case 'same-rate':
        res.json([a_responses]);
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
      case 'A-timeout':
        console.log("oiuytretyuio")
        setTimeout(() => {
          res.json([a_responses[0]]);
        }, 6000); // simulate 6s delay
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
      const matchedHotel = a_responses.filter(hotel => hotel.city.toLowerCase() === city);
      res.json([matchedHotel]);
    }
  }, delay);
});

export default router;

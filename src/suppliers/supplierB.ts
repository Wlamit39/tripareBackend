import express from 'express';

const router = express.Router();

const b_responses = [
                    {"hotelId": "b1", "name": "Hotel Sunset1", "price": 100, "city":"delhi"},
                    {"hotelId": "b2", "name": "Hotel Sunset2", "price": 130, "city":"delhi"},
                    {"hotelId": "b3", "name": "Hotel Sunset3", "price": 130, "city":"delhi"}
                  ];

router.get('/hotels', function (req: express.Request, res: express.Response): void {
  const testCase = req.query.testCase;
  const city = req.query.city;

  console.log(testCase, ">>>>>1b>>>>>")

  if (testCase) {
    switch (testCase) {
      case 'A-cheaper':
        res.json([]);
        return;
      case 'B-cheaper':
        res.json([b_responses]);
        return;
      case 'same-rate':
        res.json([]);
        return;
      case 'A-fails-B-succeeds':
        res.json([b_responses]);
        return;
      case 'both-fail':
        res.status(500).json({ error: 'Supplier A failed' });
        return;
      case 'A-empty-B-valid':
        res.json([b_responses]);
        return;
      case 'both-empty':
        res.json([]);
        return;
      case 'B-timeout':
        console.log("oiuytretyuio")
        setTimeout(() => {
          res.json([b_responses]);
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
      const matchedHotel = b_responses.filter(hotel => hotel.city.toLowerCase() === city);
      res.json(matchedHotel);
    }
  }, delay);
});

export default router;
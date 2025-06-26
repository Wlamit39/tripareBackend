import express, { Request, Response } from 'express';
import supplierARoute from './suppliers/supplierA';
import supplierBRoute from './suppliers/supplierB';
import cors from 'cors';

// import supplierTestARoute from './suppliers/suppliersTestA';
// import supplierTestBRoute from './suppliers/suppliersTestB';
import searchHotelsRoute from './routes/searchHotels';
import dotenv from 'dotenv';
dotenv.config();
console.log('TEST_MODE =', process.env.TEST_MODE);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3100;

app.use(express.json());
app.use(cors());

app.get('/', (_req: Request, res: Response) => {
  res.send('Hotel Rate Comparator backend is running.');
});

const useMockSuppliers = process.env.TEST_MODE === 'true';

app.use('/supplierA', supplierARoute);
app.use('/supplierB', supplierBRoute);

app.use('/api', searchHotelsRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

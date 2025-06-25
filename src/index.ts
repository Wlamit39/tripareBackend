// src/index.ts
import express, { Request, Response } from 'express';
import supplierARoute from './suppliers/supplierA';
import supplierBRoute from './suppliers/supplierB';
import searchHotelsRoute from './routes/searchHotels';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3100;

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('Hotel Rate Comparator backend is running.');
});

app.use('/supplierA', supplierARoute);
app.use('/supplierB', supplierBRoute);
app.use('/api', searchHotelsRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

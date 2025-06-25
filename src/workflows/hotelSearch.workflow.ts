import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { fetchFromSupplierA, fetchFromSupplierB } = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 seconds',
});

export interface SearchInput {
  city: string;
  checkIn: string;
  checkOut: string;
}

export interface Hotel {
  hotelId: string;
  name: string;
  price: number;
}

export interface SearchResult {
  result: Hotel | null;
  diagnostics: {
    supplierA: string;
    supplierB: string;
  };
}

export async function hotelSearchWorkflow(input: SearchInput): Promise<SearchResult> {
  const [a, b] = await Promise.all([
    fetchFromSupplierA(input.city, input.checkIn, input.checkOut),
    fetchFromSupplierB(input.city, input.checkIn, input.checkOut),
  ]);

  const diagnostics = {
    supplierA: a.status === 'error' ? `error: ${a.error}` : a.status,
    supplierB: b.status === 'error' ? `error: ${b.error}` : b.status,
  };

  const allHotels = [...a.data, ...b.data];
  if (allHotels.length === 0) {
    return { result: null, diagnostics };
  }

  const cheapest = allHotels.reduce((min, h) => (h.price < min.price ? h : min));

  return {
    result: cheapest, // ✅ Correct now
    diagnostics,
  };
}

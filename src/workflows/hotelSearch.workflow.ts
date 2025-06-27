import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { fetchFromSupplierA, fetchFromSupplierB } = proxyActivities<typeof activities>({
  startToCloseTimeout: '5 seconds',
  retry: {
    initialInterval: '1s',       // first retry delay
    backoffCoefficient: 2.0,     // exponential backoff factor
    maximumAttempts: 3,          // total attempts = 1 original + 2 retries
    maximumInterval: '5s',      // max delay between retries
    nonRetryableErrorTypes: ['ValidationError'], // skip retry if this is the error type thrown
  },
});

export interface SearchInput {
  checkIn: string;
  checkOut: string;
  testCase?: string;
  city?: string;
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
  console.log('💡 Workflow input:', input);
  const [a, b] = await Promise.all([
    fetchFromSupplierA(input.checkIn, input.checkOut, input.testCase ?? '', input.city?? ''),
    fetchFromSupplierB(input.checkIn, input.checkOut, input.testCase ?? '', input.city?? ''),
  ]);

  const diagnostics = {
    supplierA: a.status === 'error' ? `error: ${a.error}` : a.status,
    supplierB: b.status === 'error' ? `error: ${b.error}` : b.status,
  };

  const allHotels = [...a.data[0], ...b.data[0]];
  if (allHotels.length === 0) {
    return { result: null, diagnostics };
  }

  // const cheapest = allHotels.reduce((min, h) => (h.price < min.price ? h : min));

  const hotelMap = new Map<string, Hotel>();
  
  for (const hotel of allHotels) {
    console.log(hotel, ">>>>>hotel<<<<<")
    const key = hotel.name; // normalize name
    const existing = hotelMap.get(key);
    
    if (!existing){
        hotelMap.set(key, hotel);
    }
    else {
     if (hotel.price < existing.price){
        hotelMap.set(key, hotel);
     }
    }
  }
  const cheapestHotels = Array.from(hotelMap.values());

  return {
    result: cheapestHotels,
    diagnostics,
  } as any;
}

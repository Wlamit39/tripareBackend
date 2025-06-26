// src/workflows/activities.ts
import axios from 'axios';

let supplierACallCount = 0;
console.log('🧠 activities.ts file loaded');


interface SupplierResult {
  status: 'success' | 'empty' | 'error';
  data: any[];
  error?: string;
}

let supplierARetryCounter = 0;

export async function fetchFromSupplierA(
  checkIn: string,
  checkOut: string,
  testCase?: string,
  city?: string
): Promise<SupplierResult> {
    supplierARetryCounter++;
    console.log(supplierACallCount, "999999")
    if (supplierARetryCounter === 1 || supplierARetryCounter === 2|| supplierARetryCounter === 3|| supplierARetryCounter === 4) {
      console.log('❌ Simulating failure for retry-test on first attempt');
      throw new Error('Simulated transient error in Supplier A');
    }

    try {
      const params: Record<string, string> = {
        checkIn,
        checkOut,
      };

      if (testCase) {
        params.testCase = testCase;
      }
      if (city) {
        params.city = city;
      }

    const res = await axios.get('http://localhost:3100/supplierA/hotels', { 
      timeout: 5000,
      params, 
    });
    console.log('👀 Fetching from Supplier A with params =', params);
    console.log('🔁 Retry count for Supplier A:', supplierARetryCounter);
    console.log("supplier A res", res)
    if (!res.data || res.data.length === 0) {
      return { status: 'empty', data: [] };
    }

    return { status: 'success', data: res.data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { status: 'error', data: [], error: message };
  }
}

export async function fetchFromSupplierB(
  checkIn: string,
  checkOut: string,
  testCase: string,
  city: string
): Promise<SupplierResult> {
  try {
    const params: Record<string, string> = {
        checkIn,
        checkOut,
      };

      if (testCase) {
        params.testCase = testCase;
      }
      if (city) {
        params.city = city;
      }

      console.log('👀 Fetching from Supplier A with params =', params);
    const res = await axios.get('http://localhost:3100/supplierB/hotels', { 
      timeout: 5000,
      params, 
    });

    console.log("supplier B res", res)
    if (!res.data || res.data.length === 0) {
      return { status: 'empty', data: [] };
    }

    return { status: 'success', data: res.data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { status: 'error', data: [], error: message };
  }
}

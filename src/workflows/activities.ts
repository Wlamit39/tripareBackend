// src/workflows/activities.ts
import axios from 'axios';
console.log('🧠 activities.ts file loaded');


interface SupplierResult {
  status: 'success' | 'empty' | 'error';
  data: any[];
  error?: string;
}

export async function fetchFromSupplierA(
  checkIn: string,
  checkOut: string,
  testCase?: string
): Promise<SupplierResult> {
    try {
      const params: Record<string, string> = {
        checkIn,
        checkOut,
      };

      if (testCase) {
        params.testCase = testCase;
      }

    const res = await axios.get('http://localhost:3100/supplierA/hotels', { 
      timeout: 5000,
      params, 
    });
    console.log('👀 Fetching from Supplier A with params =', params);
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
  testCase: string
): Promise<SupplierResult> {
  try {
    const params: Record<string, string> = {
        checkIn,
        checkOut,
      };

      if (testCase) {
        params.testCase = testCase;
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

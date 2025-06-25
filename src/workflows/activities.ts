// src/workflows/activities.ts
import axios from 'axios';

interface SupplierResult {
  status: 'success' | 'empty' | 'error';
  data: any[];
  error?: string;
}

export async function fetchFromSupplierA(
  city: string,
  checkIn: string,
  checkOut: string
): Promise<SupplierResult> {
  try {
    const res = await axios.get('http://localhost:3100/supplierA/hotels', { timeout: 5000 });

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
  city: string,
  checkIn: string,
  checkOut: string
): Promise<SupplierResult> {
  try {
    const res = await axios.get('http://localhost:3100/supplierB/hotels', { timeout: 5000 });

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

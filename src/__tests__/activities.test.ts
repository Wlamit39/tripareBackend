// src/__tests__/activities.test.ts

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  fetchFromSupplierA,
  fetchFromSupplierB,
} from '../workflows/activities';

const mockAxios = new MockAdapter(axios);

describe('Activities - Supplier API Calls', () => {
  const baseUrlA = 'http://localhost:3100/supplierA/hotels';
  const baseUrlB = 'http://localhost:3100/supplierB/hotels';

  const checkIn = '2025-07-01';
  const checkOut = '2025-07-03';
  const testCase = 'A-cheaper';
  const city = 'delhi';

  afterEach(() => {
    mockAxios.reset();
  });

  it('fetchFromSupplierA - success response', async () => {
    const mockData = [{ hotelId: 'a1', name: 'Hotel A', price: 100 }];
    mockAxios.onGet(baseUrlA).reply(200, mockData);

    const result = await fetchFromSupplierA(checkIn, checkOut, testCase, city);

    expect(result.status).toBe('success');
    expect(result.data).toEqual(mockData);
  });

  it('fetchFromSupplierA - empty response', async () => {
    mockAxios.onGet(baseUrlA).reply(200, []);

    const result = await fetchFromSupplierA(checkIn, checkOut, testCase, city);

    expect(result.status).toBe('empty');
    expect(result.data).toEqual([]);
  });

  it('fetchFromSupplierA - failure (500)', async () => {
    mockAxios.onGet(baseUrlA).reply(500);

    const result = await fetchFromSupplierA(checkIn, checkOut, testCase);

    expect(result.status).toBe('error');
    expect(result.data).toEqual([]);
    expect(result.error).toMatch(/Request failed/);
  });

  it('fetchFromSupplierB - success response', async () => {
    const mockData = [{ hotelId: 'b1', name: 'Hotel B', price: 120 }];
    mockAxios.onGet(baseUrlB).reply(200, mockData);

    const result = await fetchFromSupplierB(checkIn, checkOut, testCase, city);

    expect(result.status).toBe('success');
    expect(result.data).toEqual(mockData);
  });

  it('fetchFromSupplierB - empty response', async () => {
    mockAxios.onGet(baseUrlB).reply(200, []);

    const result = await fetchFromSupplierB(checkIn, checkOut, testCase, city);

    expect(result.status).toBe('empty');
    expect(result.data).toEqual([]);
  });

  it('fetchFromSupplierB - failure (500)', async () => {
    mockAxios.onGet(baseUrlB).reply(500);

    const result = await fetchFromSupplierB(checkIn, checkOut, testCase, city);

    expect(result.status).toBe('error');
    expect(result.data).toEqual([]);
    expect(result.error).toMatch(/Request failed/);
  });
});

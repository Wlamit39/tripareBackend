import { DefaultLogger, Runtime } from '@temporalio/worker';
import { Worker } from '@temporalio/worker';
import { Client, Connection } from '@temporalio/client';
import { v4 as uuid } from 'uuid';
import { hotelSearchWorkflow, SearchInput, Hotel } from '../workflows/hotelSearch.workflow';

Runtime.install({
  logger: new DefaultLogger('ERROR'),
});

jest.setTimeout(30000); // Allow more time for real workflows

describe('hotelSearchWorkflow - full integration tests on dev server', () => {
  let client: Client;
  const taskQueue = 'hotel-search';

  beforeAll(async () => {
    const connection = await Connection.connect();
    client = new Client({ connection });
  });

  const makeTestInput = (city: string): SearchInput => ({
    city,
    checkIn: '2025-07-01',
    checkOut: '2025-07-03',
  });

  it('1. Supplier A cheaper', async () => {
    const input = makeTestInput('A-cheaper');

    const result = await client.workflow.execute(hotelSearchWorkflow, {
      workflowId: `test-A-cheaper-${uuid()}`,
      taskQueue,
      args: [input],
    });

    console.log('✅ A cheaper:', result);
    expect(result.result).not.toBeNull();
    expect(result.result!.price).toBeLessThan(200); // adjust based on your supplier A mock
    expect(result.diagnostics.supplierA).toBe('success');
  });

  it('2. Supplier B cheaper', async () => {
    const input = makeTestInput('B-cheaper');

    const result = await client.workflow.execute(hotelSearchWorkflow, {
      workflowId: `test-B-cheaper-${uuid()}`,
      taskQueue,
      args: [input],
    });

    console.log('✅ B cheaper:', result);
    expect(result.result).not.toBeNull();
    expect(result.result!.price).toBeLessThan(200); // adjust
    expect(result.diagnostics.supplierB).toBe('success');
  });

  it('3. Same rate from both — pick Supplier A', async () => {
    const input = makeTestInput('same-rate');

    const result = await client.workflow.execute(hotelSearchWorkflow, {
      workflowId: `test-same-rate-${uuid()}`,
      taskQueue,
      args: [input],
    });

    console.log('✅ Same rate:', result);
    expect(result.result).not.toBeNull();
    expect(result.result!.hotelId.startsWith('a')).toBe(true);
    expect(result.diagnostics.supplierA).toBe('success');
    expect(result.diagnostics.supplierB).toBe('success');
  });

  it('4. Supplier A fails, B succeeds', async () => {
    const input = makeTestInput('A-fails-B-succeeds');

    const result = await client.workflow.execute(hotelSearchWorkflow, {
      workflowId: `test-A-fail-B-succeed-${uuid()}`,
      taskQueue,
      args: [input],
    });

    console.log('✅ A fails, B succeeds:', result);
    expect(result.result).not.toBeNull();
    expect(result.diagnostics.supplierA).toContain('error');
    expect(result.diagnostics.supplierB).toBe('success');
  });

  it('5. Both fail', async () => {
    const input = makeTestInput('both-fail');

    const result = await client.workflow.execute(hotelSearchWorkflow, {
      workflowId: `test-both-fail-${uuid()}`,
      taskQueue,
      args: [input],
    });

    console.log('✅ Both fail:', result);
    expect(result.result).toBeNull();
    expect(result.diagnostics.supplierA).toContain('error');
    expect(result.diagnostics.supplierB).toContain('error');
  });

  it('6. One returns empty, other valid', async () => {
    const input = makeTestInput('A-empty-B-valid');

    const result = await client.workflow.execute(hotelSearchWorkflow, {
      workflowId: `test-one-empty-${uuid()}`,
      taskQueue,
      args: [input],
    });

    console.log('✅ One empty, one valid:', result);
    expect(result.result).not.toBeNull();
    expect(['empty', 'success']).toContain(result.diagnostics.supplierA);
    expect(['empty', 'success']).toContain(result.diagnostics.supplierB);
  });

  it('7. Both return empty', async () => {
    const input = makeTestInput('both-empty');

    const result = await client.workflow.execute(hotelSearchWorkflow, {
      workflowId: `test-both-empty-${uuid()}`,
      taskQueue,
      args: [input],
    });

    console.log('✅ Both empty:', result);
    expect(result.result).toBeNull();
    expect(result.diagnostics.supplierA).toBe('empty');
    expect(result.diagnostics.supplierB).toBe('empty');
  });
});

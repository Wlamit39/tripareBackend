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

  const makeTestInput = (testCase: string): SearchInput => ({
    testCase,
    checkIn: '2025-07-01',
    checkOut: '2025-07-03',
    city: 'delhi',
  });

  it('1. Supplier A cheaper', async () => {
    const input = makeTestInput('A-cheaper');
    console.log(input, ":::::::::::::")

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
});

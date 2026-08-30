const { randomUUID } = require('node:crypto');

process.env.COMMISSION_QUOTE_API_KEY = 'local-demo-key';
delete process.env.MOCK_API_ERROR_CODE;

const { app } = require('../dist/app');

describe('POST /api/commission-quotes', () => {
  it('returns the canonical commission quote for an authenticated request', async () => {
    const correlationId = randomUUID();
    const server = app.listen(0);

    await new Promise((resolve) => server.once('listening', resolve));

    try {
      const address = server.address();

      if (address === null || typeof address === 'string') {
        throw new Error('Expected the test server to listen on an ephemeral TCP port.');
      }

      const response = await fetch(`http://127.0.0.1:${address.port}/api/commission-quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': 'local-demo-key',
          'x-correlation-id': correlationId,
        },
        body: JSON.stringify({
          loanAmount: 500000,
          loanTermInMonths: 360,
          riskBand: 'LOW',
        }),
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('x-correlation-id')).toBe(correlationId);
      await expect(response.json()).resolves.toEqual({
        quoteId: expect.stringMatching(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        ),
        commissionRate: 0.001,
        upfrontCommission: 500,
        monthlyTrailCommission: 41.67,
        totalCommission: 15501.2,
      });
    } finally {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }
  });
});

const { createCommissionQuote } = require('../dist/services/commissionQuoteService');

describe('createCommissionQuote', () => {
  it('calculates and rounds the canonical LOW-risk commission quote', () => {
    const commissionQuote = createCommissionQuote({
      loanAmount: 500000,
      loanTermInMonths: 360,
      riskBand: 'LOW',
    });

    expect(commissionQuote).toEqual({
      quoteId: expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      ),
      commissionRate: 0.001,
      upfrontCommission: 500,
      monthlyTrailCommission: 41.67,
      totalCommission: 15501.2,
    });
  });
});

import { randomUUID } from 'node:crypto';

import type {
  CommissionQuoteRequest,
  CommissionQuoteResponse,
} from '../schemas/commissionQuoteSchema';

const COMMISSION_RATE_BY_RISK_BAND: Record<
  CommissionQuoteRequest['riskBand'],
  CommissionQuoteResponse['commissionRate']
> = {
  LOW: 0.001,
  MEDIUM: 0.002,
  HIGH: 0.003,
};

export function createCommissionQuote(request: CommissionQuoteRequest): CommissionQuoteResponse {
  const commissionRate = COMMISSION_RATE_BY_RISK_BAND[request.riskBand];
  const loanAmountCents = Math.round(request.loanAmount * 100);
  const upfrontCommissionCents = Math.round(loanAmountCents * commissionRate);
  const monthlyTrailCommissionCents = Math.round(upfrontCommissionCents / 12);
  const totalCommissionCents =
    upfrontCommissionCents + monthlyTrailCommissionCents * request.loanTermInMonths;

  return {
    quoteId: randomUUID(),
    commissionRate,
    upfrontCommission: upfrontCommissionCents / 100,
    monthlyTrailCommission: monthlyTrailCommissionCents / 100,
    totalCommission: totalCommissionCents / 100,
  };
}

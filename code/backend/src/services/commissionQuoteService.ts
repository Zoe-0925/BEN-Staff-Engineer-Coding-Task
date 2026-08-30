import { randomUUID } from 'node:crypto';

import { COMMISSION_QUOTE_VALIDATION_MESSAGES } from '../schemas/commissionQuoteSchema';

import type {
  CommissionQuoteFieldErrors,
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

export function validateCommissionQuoteBusinessRules(
  request: CommissionQuoteRequest,
): CommissionQuoteFieldErrors | undefined {
  const fieldErrors: CommissionQuoteFieldErrors = {};
  const roundedLoanAmount = Math.round(request.loanAmount * 100) / 100;

  if (
    request.loanAmount < 0.01 ||
    request.loanAmount > 10000000 ||
    roundedLoanAmount !== request.loanAmount
  ) {
    fieldErrors.loanAmount = COMMISSION_QUOTE_VALIDATION_MESSAGES.loanAmount.invalid;
  }

  if (request.loanTermInMonths < 1 || request.loanTermInMonths > 360) {
    fieldErrors.loanTermInMonths = COMMISSION_QUOTE_VALIDATION_MESSAGES.loanTermInMonths.invalid;
  }

  if (!Object.hasOwn(COMMISSION_RATE_BY_RISK_BAND, request.riskBand)) {
    fieldErrors.riskBand = COMMISSION_QUOTE_VALIDATION_MESSAGES.riskBand.invalid;
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

export function createCommissionQuote(request: CommissionQuoteRequest): CommissionQuoteResponse {
  const commissionRate = COMMISSION_RATE_BY_RISK_BAND[request.riskBand];
  const loanAmountCents = Math.round(request.loanAmount * 100);

  // Constant-balance model: total = upfront + (rounded monthly trail × loan term).
  // Each stage stays in integer cents because the contract requires rounding before multiplication.
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

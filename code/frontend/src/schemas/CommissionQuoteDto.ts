import type { RiskBand } from './RiskBand';

export type CommissionQuoteRequest = {
  loanAmount: number;
  loanTermInMonths: number;
  riskBand: RiskBand;
};

export type CommissionQuoteResponse = {
  quoteId: string;
  commissionRate: number;
  upfrontCommission: number;
  monthlyTrailCommission: number;
  totalCommission: number;
};

export type ErrorResponse = {
  error: {
    code:
      'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'INTERNAL_ERROR' | 'SERVICE_UNAVAILABLE';
    message: string;
    fieldErrors?: Partial<Record<keyof CommissionQuoteRequest, string>>;
  };
};

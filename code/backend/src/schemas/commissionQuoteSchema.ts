import { z } from 'zod';

export const COMMISSION_QUOTE_VALIDATION_MESSAGES = {
  loanAmount: {
    required: 'Please enter the loan amount.',
    invalid: 'Please enter a valid loan amount.',
  },
  loanTermInMonths: {
    required: 'Please enter the loan term in months.',
    invalid: 'The loan term must be between 1 and 360 months.',
  },
  riskBand: {
    required: 'Please select a risk band.',
    invalid: 'Please select a valid risk band.',
  },
} as const;

export const commissionQuoteRequestSchema = z
  .object({
    loanAmount: z.number(),
    loanTermInMonths: z.number().int(),
    riskBand: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  })
  .strict();

export type CommissionQuoteRequest = z.infer<typeof commissionQuoteRequestSchema>;

export type CommissionQuoteResponse = {
  quoteId: string;
  commissionRate: 0.001 | 0.002 | 0.003;
  upfrontCommission: number;
  monthlyTrailCommission: number;
  totalCommission: number;
};

export type CommissionQuoteFieldErrors = Partial<Record<keyof CommissionQuoteRequest, string>>;

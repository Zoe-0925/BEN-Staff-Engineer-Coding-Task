import { z } from 'zod';

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

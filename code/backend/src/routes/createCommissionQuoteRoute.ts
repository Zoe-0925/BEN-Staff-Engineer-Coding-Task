import { Router } from 'express';

import { commissionQuoteRequestSchema } from '../schemas/commissionQuoteSchema';
import { createCommissionQuote } from '../services/commissionQuoteService';

import type { RequestHandler } from 'express';

const createCommissionQuoteRoute: RequestHandler<Record<string, never>, unknown, unknown> = (
  request,
  response,
) => {
  const parsedRequest = commissionQuoteRequestSchema.safeParse(request.body);

  if (!parsedRequest.success) {
    response.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Check the loan details and try again.',
      },
    });
    return;
  }

  response.status(200).json(createCommissionQuote(parsedRequest.data));
};

export const createCommissionQuoteRouter = Router();

createCommissionQuoteRouter.post('/api/commission-quotes', createCommissionQuoteRoute);

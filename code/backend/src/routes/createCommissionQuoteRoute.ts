import { Router } from 'express';

import {
  COMMISSION_QUOTE_VALIDATION_MESSAGES,
  commissionQuoteRequestSchema,
} from '../schemas/commissionQuoteSchema';
import {
  createCommissionQuote,
  validateCommissionQuoteBusinessRules,
} from '../services/commissionQuoteService';

import type { RequestHandler } from 'express';
import type { CommissionQuoteFieldErrors } from '../schemas/commissionQuoteSchema';
import type { ZodIssue } from 'zod';

const VALIDATION_ERROR_MESSAGE = 'Check the loan details and try again.';

function isFieldMissing(requestBody: unknown, fieldName: string): boolean {
  if (typeof requestBody !== 'object' || requestBody === null || Array.isArray(requestBody)) {
    return true;
  }

  return (
    !Object.hasOwn(requestBody, fieldName) || Reflect.get(requestBody, fieldName) === undefined
  );
}

function mapSchemaFieldErrors(
  issues: ZodIssue[],
  requestBody: unknown,
): CommissionQuoteFieldErrors {
  const fieldErrors: CommissionQuoteFieldErrors = {};

  if (typeof requestBody !== 'object' || requestBody === null || Array.isArray(requestBody)) {
    return {
      loanAmount: COMMISSION_QUOTE_VALIDATION_MESSAGES.loanAmount.required,
      loanTermInMonths: COMMISSION_QUOTE_VALIDATION_MESSAGES.loanTermInMonths.required,
      riskBand: COMMISSION_QUOTE_VALIDATION_MESSAGES.riskBand.required,
    };
  }

  for (const issue of issues) {
    const fieldName = issue.path[0];

    if (fieldName === 'loanAmount') {
      fieldErrors.loanAmount = isFieldMissing(requestBody, fieldName)
        ? COMMISSION_QUOTE_VALIDATION_MESSAGES.loanAmount.required
        : COMMISSION_QUOTE_VALIDATION_MESSAGES.loanAmount.invalid;
    }

    if (fieldName === 'loanTermInMonths') {
      fieldErrors.loanTermInMonths = isFieldMissing(requestBody, fieldName)
        ? COMMISSION_QUOTE_VALIDATION_MESSAGES.loanTermInMonths.required
        : COMMISSION_QUOTE_VALIDATION_MESSAGES.loanTermInMonths.invalid;
    }

    if (fieldName === 'riskBand') {
      fieldErrors.riskBand = isFieldMissing(requestBody, fieldName)
        ? COMMISSION_QUOTE_VALIDATION_MESSAGES.riskBand.required
        : COMMISSION_QUOTE_VALIDATION_MESSAGES.riskBand.invalid;
    }
  }

  return fieldErrors;
}

const createCommissionQuoteRoute: RequestHandler<Record<string, never>, unknown, unknown> = (
  request,
  response,
) => {
  const parsedRequest = commissionQuoteRequestSchema.safeParse(request.body);

  if (!parsedRequest.success) {
    response.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: VALIDATION_ERROR_MESSAGE,
        fieldErrors: mapSchemaFieldErrors(parsedRequest.error.issues, request.body),
      },
    });
    return;
  }

  const businessRuleErrors = validateCommissionQuoteBusinessRules(parsedRequest.data);

  if (businessRuleErrors) {
    response.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: VALIDATION_ERROR_MESSAGE,
        fieldErrors: businessRuleErrors,
      },
    });
    return;
  }

  if (process.env.MOCK_API_ERROR_CODE === '500') {
    response.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong. Please contact your administrator.',
      },
    });
    return;
  }

  if (process.env.MOCK_API_ERROR_CODE === '503') {
    response.status(503).json({
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'The quote service is temporarily unavailable. Please try again later.',
      },
    });
    return;
  }

  response.status(200).json(createCommissionQuote(parsedRequest.data));
};

export const createCommissionQuoteRouter = Router();

createCommissionQuoteRouter.post('/api/commission-quotes', createCommissionQuoteRoute);

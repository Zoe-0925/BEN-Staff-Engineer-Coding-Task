import axios from 'axios';

import type { ErrorResponse } from '../schemas/CommissionQuoteDto';
import type { RequestState } from '../schemas/RequestState';

const TIMEOUT_MESSAGE = "We couldn't generate the quote. Please try again later.";

const EXPECTED_ERROR_CODES: Partial<Record<number, ErrorResponse['error']['code']>> = {
  400: 'VALIDATION_ERROR',
  401: 'UNAUTHORIZED',
  404: 'NOT_FOUND',
  500: 'INTERNAL_ERROR',
  503: 'SERVICE_UNAVAILABLE',
};

export function mapRequestError(error: unknown, correlationId: string): RequestState {
  if (!axios.isAxiosError<ErrorResponse>(error)) {
    return { status: 'unknownError', correlationId };
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return {
      status: 'serviceError',
      correlationId,
      message: TIMEOUT_MESSAGE,
    };
  }

  const status = error.response?.status;
  const responseError = error.response?.data?.error;

  if (status === 500) {
    return { status: 'unknownError', correlationId };
  }

  if (
    !status ||
    !responseError ||
    responseError.code !== EXPECTED_ERROR_CODES[status] ||
    typeof responseError.message !== 'string'
  ) {
    return { status: 'unknownError', correlationId };
  }

  switch (status) {
    case 400:
      return {
        status: 'serviceError',
        correlationId,
        message: responseError.message,
        fieldErrors: responseError.fieldErrors,
      };
    case 401:
    case 404:
    case 503:
      return {
        status: 'serviceError',
        correlationId,
        message: responseError.message,
      };
    default:
      return { status: 'unknownError', correlationId };
  }
}

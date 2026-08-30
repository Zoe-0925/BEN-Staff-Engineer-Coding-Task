import axios from 'axios';
import log from 'loglevel';

import type { ErrorResponse } from '../schemas/CommissionQuoteDto';
import type { LogEntry } from '../schemas/LogEntry';
import type { RequestState } from '../schemas/RequestState';

const TIMEOUT_MESSAGE = "We couldn't generate the quote. Please try again later.";

const EXPECTED_ERROR_CODES: Partial<Record<number, ErrorResponse['error']['code']>> = {
  400: 'VALIDATION_ERROR',
  401: 'UNAUTHORIZED',
  404: 'NOT_FOUND',
  503: 'SERVICE_UNAVAILABLE',
};

function handleUnknownError(correlationId: string, message: string): RequestState {
  const unexpectedErrorLog: LogEntry = {
    level: 'error',
    event: 'UNEXPECTED_FRONTEND_ERROR',
    message,
    correlationId,
  };
  log.error(unexpectedErrorLog);

  return { status: 'unknownError', correlationId };
}

export function handleRequestError(error: unknown, correlationId: string): RequestState {
  if (!axios.isAxiosError<ErrorResponse>(error)) {
    return handleUnknownError(
      correlationId,
      'Commission quote request failed with a non-Axios error.',
    );
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
    return handleUnknownError(
      correlationId,
      'Commission quote API returned an internal server error.',
    );
  }

  if (!status) {
    return handleUnknownError(
      correlationId,
      'Commission quote request failed without an HTTP response.',
    );
  }

  if (
    !responseError ||
    responseError.code !== EXPECTED_ERROR_CODES[status] ||
    typeof responseError.message !== 'string'
  ) {
    return handleUnknownError(
      correlationId,
      'Commission quote API returned an unrecognized or malformed error response.',
    );
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
      return handleUnknownError(
        correlationId,
        `Commission quote API returned unsupported HTTP status ${status}.`,
      );
  }
}

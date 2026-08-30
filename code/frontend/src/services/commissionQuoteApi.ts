import axios from 'axios';
import log from 'loglevel';

import type {
  CommissionQuoteRequest,
  CommissionQuoteResponse,
} from '../schemas/CommissionQuoteDto';
import type { LogEntry } from '../schemas/LogEntry';

function readEnvironmentVariable(environmentValue: unknown): string | undefined {
  return typeof environmentValue === 'string' ? environmentValue : undefined;
}

function readApiTimeoutMs(environmentValue: unknown): number {
  if (typeof environmentValue !== 'string') {
    return 60_000;
  }

  const timeoutMs = Number(environmentValue);
  return Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 60_000;
}

const API_BASE_URL = readEnvironmentVariable(import.meta.env.VITE_COMMISSION_QUOTE_API_BASE_URL);
const API_KEY = readEnvironmentVariable(import.meta.env.VITE_COMMISSION_QUOTE_API_KEY);
const API_TIMEOUT_MS = readApiTimeoutMs(import.meta.env.VITE_COMMISSION_QUOTE_API_TIMEOUT_MS);

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
});

function readCorrelationId(headers: unknown, fallbackCorrelationId: string): string {
  if (!headers || typeof headers !== 'object') {
    return fallbackCorrelationId;
  }

  const responseCorrelationId: unknown = Reflect.get(headers, 'x-correlation-id');
  return typeof responseCorrelationId === 'string' ? responseCorrelationId : fallbackCorrelationId;
}

export async function createCommissionQuote(
  request: CommissionQuoteRequest,
  correlationId: string,
): Promise<CommissionQuoteResponse> {
  const requestLog: LogEntry = {
    level: 'info',
    event: 'QUOTE_REQUEST_STARTED',
    message: 'Commission quote request started.',
    correlationId,
  };
  log.info(requestLog);

  try {
    const response = await axiosClient.post<CommissionQuoteResponse>(
      '/api/commission-quotes',
      request,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY,
          'x-correlation-id': correlationId,
        },
      },
    );
    const responseCorrelationId = readCorrelationId(response.headers, correlationId);
    const responseLog: LogEntry = {
      level: 'info',
      event: 'QUOTE_REQUEST_SUCCEEDED',
      message: 'Commission quote request succeeded.',
      correlationId: responseCorrelationId,
    };
    log.info(responseLog);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const responseCorrelationId = readCorrelationId(error.response?.headers, correlationId);
      const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
      const failureLog: LogEntry = isTimeout
        ? {
            level: 'error',
            event: 'QUOTE_REQUEST_TIMEOUT',
            message: 'Commission quote request timed out.',
            correlationId: responseCorrelationId,
          }
        : {
            level: 'error',
            event: 'QUOTE_REQUEST_FAILED',
            message: 'Commission quote request failed.',
            correlationId: responseCorrelationId,
          };
      log.error(failureLog);
    }

    throw error;
  }
}

import axios from 'axios';
import log from 'loglevel';
import { useEffect, useRef, useState } from 'react';

import { CommissionQuoteForm } from '../components/CommissionQuoteForm/CommissionQuoteForm';
import { CommissionQuoteResult } from '../components/CommissionQuoteResult/CommissionQuoteResult';
import { UnknownError } from '../components/UnknownError/UnknownError';
import { useConfig } from '../hooks/useConfig';
import { mapCommissionQuoteRequest } from '../mappers/commissionQuoteRequestMapper';
import type { ErrorResponse } from '../schemas/CommissionQuoteDto';
import type { FieldMetadata } from '../schemas/FieldMetadata';
import type { LogEntry } from '../schemas/LogEntry';
import type { RequestState } from '../schemas/RequestState';
import { createCommissionQuote } from '../services/commissionQuoteApi';
import {
  LoadingNote,
  LoadingPlaceholder,
  LoadingResult,
  PageAlert,
  PageContainer,
  PageHeading,
  PageIntroduction,
} from './CommissionQuotePage.styles';

const FORM_CONTEXT = 'commissionQuote';
const TIMEOUT_MESSAGE = "We couldn't generate the quote. Please try again later.";

const EXPECTED_ERROR_CODES: Partial<Record<number, ErrorResponse['error']['code']>> = {
  400: 'VALIDATION_ERROR',
  401: 'UNAUTHORIZED',
  404: 'NOT_FOUND',
  500: 'INTERNAL_ERROR',
  503: 'SERVICE_UNAVAILABLE',
};

function isErrorResponse(response: unknown): response is ErrorResponse {
  if (!response || typeof response !== 'object' || !('error' in response)) {
    return false;
  }

  const responseError: unknown = response.error;

  if (
    !responseError ||
    typeof responseError !== 'object' ||
    !('code' in responseError) ||
    !('message' in responseError)
  ) {
    return false;
  }

  return typeof responseError.code === 'string' && typeof responseError.message === 'string';
}

function mapRequestError(error: unknown, correlationId: string): RequestState {
  if (!axios.isAxiosError<unknown>(error)) {
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
  const response = error.response?.data;

  if (status === 500) {
    return { status: 'unknownError', correlationId };
  }

  if (
    status === undefined ||
    !isErrorResponse(response) ||
    response.error.code !== EXPECTED_ERROR_CODES[status]
  ) {
    return { status: 'unknownError', correlationId };
  }

  switch (status) {
    case 400:
      return {
        status: 'serviceError',
        correlationId,
        message: response.error.message,
        fieldErrors: response.error.fieldErrors,
      };
    case 401:
    case 404:
    case 503:
      return {
        status: 'serviceError',
        correlationId,
        message: response.error.message,
      };
    default:
      return { status: 'unknownError', correlationId };
  }
}

export function CommissionQuotePage() {
  const config = useConfig(FORM_CONTEXT);
  const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
  const [configErrorCorrelationId] = useState(() => crypto.randomUUID());
  const hasLoggedConfigError = useRef(false);

  useEffect(() => {
    if (config || hasLoggedConfigError.current) {
      return;
    }

    const configErrorLog: LogEntry = {
      level: 'error',
      event: 'CONFIG_NOT_FOUND',
      message: `Config not found for formContext: ${FORM_CONTEXT}`,
      correlationId: configErrorCorrelationId,
    };
    log.error(configErrorLog);
    hasLoggedConfigError.current = true;
  }, [config, configErrorCorrelationId]);

  async function handleSubmit(values: FieldMetadata[]): Promise<void> {
    if (requestState.status === 'loading') {
      return;
    }

    const correlationId = crypto.randomUUID();
    const request = mapCommissionQuoteRequest(values);

    if (!request) {
      const mappingErrorLog: LogEntry = {
        level: 'error',
        event: 'UNEXPECTED_FRONTEND_ERROR',
        message: 'Unable to map commission quote request.',
        correlationId,
      };
      log.error(mappingErrorLog);
      setRequestState({ status: 'unknownError', correlationId });
      return;
    }

    setRequestState({ status: 'loading', correlationId });

    try {
      const response = await createCommissionQuote(request, correlationId);
      setRequestState({ status: 'success', correlationId, response });
    } catch (error: unknown) {
      const nextRequestState = mapRequestError(error, correlationId);

      if (nextRequestState.status === 'unknownError') {
        const unexpectedErrorLog: LogEntry = {
          level: 'error',
          event: 'UNEXPECTED_FRONTEND_ERROR',
          message: 'Unexpected commission quote request error.',
          correlationId,
        };
        log.error(unexpectedErrorLog);
      }

      setRequestState(nextRequestState);
    }
  }

  if (!config) {
    return <UnknownError correlationId={configErrorCorrelationId} />;
  }

  if (requestState.status === 'unknownError') {
    return <UnknownError correlationId={requestState.correlationId} />;
  }

  const isLoading = requestState.status === 'loading';
  const serviceError = requestState.status === 'serviceError' ? requestState : undefined;
  const quote = requestState.status === 'success' ? requestState.response : undefined;

  return (
    <PageContainer>
      <PageHeading>Commission quote</PageHeading>
      <PageIntroduction>Enter the loan details to generate a commission quote.</PageIntroduction>
      {serviceError && <PageAlert role="alert">{serviceError.message}</PageAlert>}
      <CommissionQuoteForm
        fields={config.value}
        isLoading={isLoading}
        apiFieldErrors={serviceError?.fieldErrors}
        onSubmit={handleSubmit}
      />
      {isLoading && (
        <>
          <LoadingNote>
            We are generating your commission quote. This may take a moment.
          </LoadingNote>
          <LoadingResult aria-label="Quote result loading" aria-live="polite">
            <LoadingPlaceholder>Loading...</LoadingPlaceholder>
          </LoadingResult>
        </>
      )}
      {quote && <CommissionQuoteResult quote={quote} />}
    </PageContainer>
  );
}

import log from 'loglevel';
import { useEffect, useRef, useState } from 'react';

import { CommissionQuoteForm } from '../components/CommissionQuoteForm/CommissionQuoteForm';
import { CommissionQuoteResult } from '../components/CommissionQuoteResult/CommissionQuoteResult';
import { UnknownError } from '../components/UnknownError/UnknownError';
import { useConfig } from '../hooks/useConfig';
import { mapCommissionQuoteRequest } from '../mappers/commissionQuoteRequestMapper';
import type { FieldMetadata } from '../schemas/FieldMetadata';
import type { LogEntry } from '../schemas/LogEntry';
import type { RequestState } from '../schemas/RequestState';
import { createCommissionQuote } from '../services/commissionQuoteApi';
import { mapRequestError } from '../utils/mapRequestError';
import {
  LoadingNote,
  LoadingPlaceholder,
  LoadingResult,
  PageContainer,
  PageHeading,
  PageIntroduction,
  PageLevelError,
} from './CommissionQuotePage.styles';

const FORM_CONTEXT = 'commissionQuote';

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

    // A validated form reaches this branch only when its metadata no longer matches the DTO contract.
    if (!request) {
      const mappingErrorLog: LogEntry = {
        level: 'error',
        event: 'UNEXPECTED_FRONTEND_ERROR',
        message:
          'Commission quote request mapping failed: required metadata is missing or has an unexpected type.',
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
          message:
            'Commission quote request failed: unrecognized error, network failure, or malformed API response.',
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
      {serviceError && <PageLevelError role="alert">{serviceError.message}</PageLevelError>}
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

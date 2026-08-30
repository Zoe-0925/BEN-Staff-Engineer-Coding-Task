import type { CommissionQuoteResponse, ErrorResponse } from './CommissionQuoteDto';

export type RequestState =
  | {
      status: 'idle';
    }
  | {
      status: 'loading';
      correlationId: string;
    }
  | {
      status: 'success';
      correlationId: string;
      response: CommissionQuoteResponse;
    }
  | {
      status: 'serviceError';
      correlationId: string;
      message: string;
      fieldErrors?: ErrorResponse['error']['fieldErrors'];
    }
  | {
      status: 'unknownError';
      correlationId: string;
    };

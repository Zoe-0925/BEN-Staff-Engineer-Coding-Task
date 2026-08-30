import type { CommissionQuoteRequest } from '../schemas/CommissionQuoteDto';
import type { FieldMetadata } from '../schemas/FieldMetadata';

export function mapCommissionQuoteRequest(values: FieldMetadata[]): CommissionQuoteRequest {
  const requestValues = {
    loanAmount: values.find(({ name }) => name === 'loanAmount')?.value,
    loanTermInMonths: values.find(({ name }) => name === 'loanTermInMonths')?.value,
    riskBand: values.find(({ name }) => name === 'riskBand')?.value,
  };

  // CommissionQuoteForm validates the metadata before this mapping-only boundary is called.
  return requestValues as CommissionQuoteRequest;
}

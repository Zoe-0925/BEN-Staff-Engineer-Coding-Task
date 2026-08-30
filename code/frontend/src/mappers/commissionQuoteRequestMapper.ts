import type { CommissionQuoteRequest } from '../schemas/CommissionQuoteDto';
import type { FieldMetadata } from '../schemas/FieldMetadata';

export function mapCommissionQuoteRequest(
  values: FieldMetadata[],
): CommissionQuoteRequest | undefined {
  const loanAmount = values.find(({ name }) => name === 'loanAmount')?.value;
  const loanTermInMonths = values.find(({ name }) => name === 'loanTermInMonths')?.value;
  const riskBand = values.find(({ name }) => name === 'riskBand')?.value;

  if (
    typeof loanAmount !== 'number' ||
    typeof loanTermInMonths !== 'number' ||
    typeof riskBand !== 'string'
  ) {
    return undefined;
  }

  return {
    loanAmount,
    loanTermInMonths,
    riskBand,
  };
}

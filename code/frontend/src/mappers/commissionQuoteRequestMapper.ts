import type { CommissionQuoteRequest } from '../schemas/CommissionQuoteDto';
import type { FieldMetadata } from '../schemas/FieldMetadata';
import type { FieldValue } from '../schemas/FieldValue';

function getRequiredFieldValue(values: FieldMetadata[], name: string): FieldValue {
  const fieldMetadata = values.find((field) => field.name === name);

  if (fieldMetadata === undefined || fieldMetadata.value === null) {
    throw new Error(`Cannot map commission quote request: ${name} has no value.`);
  }

  return fieldMetadata.value;
}

export function mapCommissionQuoteRequest(values: FieldMetadata[]): CommissionQuoteRequest {
  const loanAmount = getRequiredFieldValue(values, 'loanAmount');
  const loanTermInMonths = getRequiredFieldValue(values, 'loanTermInMonths');
  const riskBand = getRequiredFieldValue(values, 'riskBand');

  if (typeof loanAmount !== 'number') {
    throw new Error('Cannot map commission quote request: loanAmount must be a number.');
  }

  if (typeof loanTermInMonths !== 'number') {
    throw new Error('Cannot map commission quote request: loanTermInMonths must be a number.');
  }

  if (typeof riskBand !== 'string') {
    throw new Error('Cannot map commission quote request: riskBand must be a string.');
  }

  return {
    loanAmount,
    loanTermInMonths,
    riskBand,
  };
}

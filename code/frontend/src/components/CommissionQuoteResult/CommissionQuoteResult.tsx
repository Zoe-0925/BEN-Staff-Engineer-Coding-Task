import styled from 'styled-components';

import type { CommissionQuoteResponse } from '../../schemas/CommissionQuoteDto';

type CommissionQuoteResultProps = {
  quote: CommissionQuoteResponse;
};

const percentageFormatter = new Intl.NumberFormat('en-AU', {
  style: 'percent',
  maximumFractionDigits: 2,
});

const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

const Result = styled.section`
  margin-top: ${({ theme }) => theme.spacing.result};
  padding: ${({ theme }) => theme.spacing.section};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.surface};
`;

const ResultHeading = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.resultHeadingGap};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.resultHeading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const ResultRow = styled.div<{ $isTotal?: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.mobileGutter};
  padding: ${({ $isTotal, theme }) =>
    $isTotal ? `${theme.spacing.xxLarge} 0 ${theme.spacing.medium}` : `${theme.spacing.medium} 0`};
  border-bottom: ${({ $isTotal, theme }) =>
    $isTotal ? 0 : `1px solid ${theme.colors.borderSoft}`};
  font-size: ${({ $isTotal, theme }) =>
    $isTotal ? theme.typography.fontSize.control : theme.typography.fontSize.bodySmall};
  font-weight: ${({ $isTotal, theme }) =>
    $isTotal ? theme.typography.fontWeight.strong : theme.typography.fontWeight.regular};
  line-height: 1.35;
`;

const ResultLabel = styled.span`
  color: ${({ theme }) => theme.colors.muted};
`;

const ResultValue = styled.span<{ $isTotal?: boolean }>`
  overflow-wrap: anywhere;
  color: ${({ $isTotal, theme }) => ($isTotal ? theme.colors.primary : theme.colors.text)};
  font-variant-numeric: tabular-nums;
  text-align: right;
`;

export function CommissionQuoteResult({ quote }: CommissionQuoteResultProps) {
  return (
    <Result aria-label="Successful quote result" aria-live="polite">
      <ResultHeading>Quote result</ResultHeading>
      <ResultRow>
        <ResultLabel>Quote ID</ResultLabel>
        <ResultValue>{quote.quoteId}</ResultValue>
      </ResultRow>
      <ResultRow>
        <ResultLabel>Commission rate</ResultLabel>
        <ResultValue>{percentageFormatter.format(quote.commissionRate)}</ResultValue>
      </ResultRow>
      <ResultRow>
        <ResultLabel>Upfront commission</ResultLabel>
        <ResultValue>{currencyFormatter.format(quote.upfrontCommission)}</ResultValue>
      </ResultRow>
      <ResultRow>
        <ResultLabel>Monthly trail commission</ResultLabel>
        <ResultValue>{currencyFormatter.format(quote.monthlyTrailCommission)}</ResultValue>
      </ResultRow>
      <ResultRow $isTotal>
        <ResultLabel>Total commission</ResultLabel>
        <ResultValue $isTotal>{currencyFormatter.format(quote.totalCommission)}</ResultValue>
      </ResultRow>
    </Result>
  );
}

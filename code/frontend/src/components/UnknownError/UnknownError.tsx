import styled from 'styled-components';

type UnknownErrorProps = {
  correlationId: string;
};

const SystemPage = styled.main`
  display: grid;
  flex: 1;
  width: min(520px, calc(100% - 64px));
  margin: 0 auto;
  place-content: center;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    width: calc(100% - ${({ theme }) => theme.spacing.result});
  }
`;

const ErrorHeading = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.systemHeading};
  line-height: 1.3;
`;

const ErrorMessage = styled.p`
  margin: ${({ theme }) => theme.spacing.xLarge} 0 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  line-height: 1.5;
`;

const CorrelationId = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.muted};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
`;

export function UnknownError({ correlationId }: UnknownErrorProps) {
  return (
    <SystemPage>
      <div>
        <ErrorHeading>Something went wrong.</ErrorHeading>
        <ErrorMessage>
          Please contact your administrator.
          <CorrelationId>Correlation ID: {correlationId}</CorrelationId>
        </ErrorMessage>
      </div>
    </SystemPage>
  );
}

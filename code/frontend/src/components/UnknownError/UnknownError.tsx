import styled from 'styled-components';

type UnknownErrorProps = {
  correlationId: string;
};

const SystemPage = styled.div`
  display: grid;
  flex: 1;
  width: ${({ theme }) =>
    `min(${theme.sizes.pageMaxWidth}, calc(100% - ${theme.spacing.pageHorizontal}))`};
  margin: 0 auto;
  place-content: center;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    width: calc(100% - ${({ theme }) => theme.spacing.pageHorizontalMobile});
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

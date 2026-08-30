import styled from 'styled-components';

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

const ErrorCode = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.systemCode};
  font-weight: ${({ theme }) => theme.typography.fontWeight.strong};
  line-height: 1;
`;

const ErrorHeading = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.systemHeading};
  line-height: 1.3;
`;

export function NotFound() {
  return (
    <SystemPage>
      <div>
        <ErrorCode>404</ErrorCode>
        <ErrorHeading>Page not found.</ErrorHeading>
      </div>
    </SystemPage>
  );
}

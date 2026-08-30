import styled from 'styled-components';

import brandLogo from '../../assets/brand-logo.svg';

const Header = styled.header`
  display: flex;
  height: ${({ theme }) => theme.sizes.headerHeight};
  flex: 0 0 ${({ theme }) => theme.sizes.headerHeight};
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSoft};
`;

const HeaderContent = styled.div`
  display: flex;
  width: min(100%, ${({ theme }) => theme.sizes.headerMaxWidth});
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.mobileGutter};
  align-items: center;
`;

const LogoLink = styled.a`
  display: block;
  flex: 0 0 auto;
  border-radius: 50%;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const Logo = styled.img`
  display: block;
  width: ${({ theme }) => theme.sizes.logo};
  height: ${({ theme }) => theme.sizes.logo};
`;

const ProductName = styled.span`
  margin-left: ${({ theme }) => theme.spacing.xLarge};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const Divider = styled.span`
  margin: 0 ${({ theme }) => theme.spacing.large};
  color: ${({ theme }) => theme.colors.border};
`;

const CurrentPage = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

export function AppHeader() {
  return (
    <Header aria-label="Application header">
      <HeaderContent>
        <LogoLink href="/" aria-label="Return to commission quote home">
          <Logo src={brandLogo} alt="Placeholder B logo" />
        </LogoLink>
        <ProductName>Home loans</ProductName>
        <Divider aria-hidden="true">/</Divider>
        <CurrentPage aria-current="page">Commission quote</CurrentPage>
      </HeaderContent>
    </Header>
  );
}

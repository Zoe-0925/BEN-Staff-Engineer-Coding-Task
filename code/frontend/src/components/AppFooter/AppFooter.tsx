import styled from 'styled-components';

const Footer = styled.footer`
  display: flex;
  min-height: ${({ theme }) => theme.sizes.footerMinHeight};
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${({ theme }) => theme.colors.borderSoft};
  color: ${({ theme }) => theme.colors.muted};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  text-align: center;
`;

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return <Footer>© {currentYear} B Mock. All rights reserved.</Footer>;
}

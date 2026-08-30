import styled from 'styled-components';

export const PageContainer = styled.main`
  flex: 1;
  width: min(520px, calc(100% - 64px));
  margin: ${({ theme }) => theme.spacing.page} auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    width: calc(100% - ${({ theme }) => theme.spacing.result});
  }
`;

export const PageHeading = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.pageHeading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  letter-spacing: -0.025em;
  line-height: 1.2;
`;

export const PageIntroduction = styled.p`
  margin: ${({ theme }) => theme.spacing.large} 0 ${({ theme }) => theme.spacing.result};
  color: ${({ theme }) => theme.colors.muted};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  line-height: 1.5;
`;

export const PageLevelError = styled.div`
  margin: -${({ theme }) => theme.spacing.medium} 0 ${({ theme }) => theme.spacing.section};
  padding: ${({ theme }) => theme.typography.fontSize.bodySmall}
    ${({ theme }) => theme.spacing.xxLarge};
  border-left: ${({ theme }) => theme.radii.small} solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radii.small};
  background: ${({ theme }) => theme.colors.errorSoft};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.bodySmall};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 1.45;
`;

export const LoadingNote = styled.p`
  margin: ${({ theme }) => theme.spacing.medium} 0 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  line-height: 1.4;
`;

export const LoadingResult = styled.section`
  display: grid;
  min-height: 112px;
  margin-top: ${({ theme }) => theme.spacing.result};
  padding: ${({ theme }) => theme.spacing.section};
  place-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.surface};
`;

export const LoadingPlaceholder = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: ${({ theme }) => theme.typography.fontSize.bodySmall};
`;

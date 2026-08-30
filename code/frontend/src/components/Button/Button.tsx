import { keyframes } from 'styled-components';
import styled from 'styled-components';

type ButtonProps = {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  disabled: boolean;
};

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const StyledButton = styled.button`
  display: flex;
  width: 100%;
  height: ${({ theme }) => theme.sizes.controlHeight};
  margin-top: ${({ theme }) => theme.spacing.xSmall};
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.large};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.control};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSize.control};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }
`;

const Spinner = styled.span`
  width: ${({ theme }) => theme.sizes.spinner};
  height: ${({ theme }) => theme.sizes.spinner};
  border: 2px solid ${({ theme }) => theme.colors.spinnerTrack};
  border-top-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.round};
  animation: ${rotate} 0.8s linear infinite;
`;

export function Button({ label, loadingLabel, isLoading, disabled }: ButtonProps) {
  return (
    <StyledButton type="submit" disabled={disabled || isLoading} aria-busy={isLoading}>
      {isLoading && <Spinner aria-hidden="true" />}
      {isLoading ? loadingLabel : label}
    </StyledButton>
  );
}

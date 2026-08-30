import type { ChangeEvent } from 'react';
import styled from 'styled-components';

import type { Field } from '../../schemas/Field';
import type { FieldMetadata } from '../../schemas/FieldMetadata';
import { GridItem } from '../../styles/Grid';
import { validateField } from '../../utils/validateField';

type SelectProps = {
  field: Field;
  value: string | undefined;
  error?: string;
  disabled: boolean;
  onChange: (field: FieldMetadata, error?: string) => void;
  onBlur: (name: string, error?: string) => void;
};

const FieldGridItem = styled(GridItem)<{ $hasError: boolean }>`
  margin-bottom: ${({ $hasError, theme }) =>
    $hasError ? theme.spacing.fieldWithError : theme.spacing.field};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.label};
`;

const RequiredIndicator = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const Control = styled.div<{ $hasError: boolean; $disabled: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: ${({ theme }) => theme.sizes.controlHeight};
  border: ${({ $hasError, theme }) =>
    $hasError ? `2px solid ${theme.colors.error}` : `1px solid ${theme.colors.border}`};
  border-radius: ${({ theme }) => theme.radii.control};
  background: ${({ $disabled, theme }) =>
    $disabled ? theme.colors.background : theme.colors.surface};
  color: ${({ $disabled, theme }) => ($disabled ? theme.colors.muted : theme.colors.text)};

  &:focus-within {
    border-color: ${({ $hasError, theme }) =>
      $hasError ? theme.colors.error : theme.colors.primary};
  }
`;

const SelectElement = styled.select`
  width: 100%;
  height: 100%;
  padding: 0 ${({ theme }) => theme.sizes.selectEndPadding} 0
    ${({ theme }) => theme.spacing.xxLarge};
  appearance: none;
  border: 0;
  outline: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSize.control};
`;

const Chevron = styled.span`
  position: absolute;
  right: ${({ theme }) => theme.sizes.chevronInset};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  pointer-events: none;
`;

const ErrorText = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  line-height: 1.4;
`;

export function Select({ field, value, error, disabled, onChange, onBlur }: SelectProps) {
  const errorId = `${field.name}-error`;
  const options = field.type === 'Select' ? field.options : [];
  const placeholder = field.type === 'Select' ? field.placeholder : undefined;

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextValue = event.currentTarget.value || undefined;
    const nextError = error === undefined ? undefined : validateField(field, nextValue);

    onChange({ name: field.name, value: nextValue }, nextError);
  }

  function handleBlur() {
    onBlur(field.name, validateField(field, value));
  }

  return (
    <FieldGridItem $width={field.width} $hasError={error !== undefined}>
      <Label htmlFor={field.name}>
        {field.label}{' '}
        {field.isRequired && <RequiredIndicator aria-hidden="true">*</RequiredIndicator>}
      </Label>
      <Control $hasError={error !== undefined} $disabled={disabled}>
        <SelectElement
          id={field.name}
          name={field.name}
          value={value ?? ''}
          required={field.isRequired}
          disabled={disabled}
          aria-invalid={error !== undefined}
          aria-describedby={error === undefined ? undefined : errorId}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          {placeholder !== undefined && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectElement>
        <Chevron aria-hidden="true">▼</Chevron>
      </Control>
      {error !== undefined && (
        <ErrorText id={errorId} role="alert">
          {error}
        </ErrorText>
      )}
    </FieldGridItem>
  );
}

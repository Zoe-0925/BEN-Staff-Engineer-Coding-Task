import type { ChangeEvent } from 'react';
import styled from 'styled-components';

import type { Field } from '../../schemas/Field';
import type { FieldMetadata } from '../../schemas/FieldMetadata';
import { GridItem } from '../../styles/Grid';
import { validateField } from '../../utils/validateField';

type InputProps = {
  field: Field;
  value: number | undefined;
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
  display: flex;
  align-items: center;
  width: 100%;
  height: ${({ theme }) => theme.sizes.controlHeight};
  overflow: hidden;
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

const Prefix = styled.span`
  display: grid;
  flex: 0 0 ${({ theme }) => theme.sizes.prefixWidth};
  height: 100%;
  place-items: center;
  border-right: 1px solid ${({ theme }) => theme.colors.borderSoft};
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
`;

const NumberInput = styled.input`
  min-width: 0;
  height: 100%;
  flex: 1;
  padding: 0 ${({ theme }) => theme.spacing.xxLarge};
  border: 0;
  outline: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSize.control};
`;

const Suffix = styled.span`
  padding-right: ${({ theme }) => theme.spacing.xxLarge};
  color: ${({ theme }) => theme.colors.muted};
  font-size: ${({ theme }) => theme.typography.fontSize.bodySmall};
`;

const ErrorText = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  line-height: 1.4;
`;

function getStep(field: Field): number | 'any' {
  if (field.type !== 'Input') {
    return 'any';
  }

  if (field.validation.integer === true) {
    return 1;
  }

  if (field.validation.maxDecimalPlaces !== undefined) {
    return 10 ** -field.validation.maxDecimalPlaces;
  }

  return 'any';
}

export function Input({ field, value, error, disabled, onChange, onBlur }: InputProps) {
  const errorId = `${field.name}-error`;
  const inputValidation = field.type === 'Input' ? field.validation : undefined;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue =
      event.currentTarget.value === '' || Number.isNaN(event.currentTarget.valueAsNumber)
        ? undefined
        : event.currentTarget.valueAsNumber;
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
        {field.type === 'Input' && field.prefix !== undefined && (
          <Prefix aria-hidden="true">{field.prefix}</Prefix>
        )}
        <NumberInput
          id={field.name}
          name={field.name}
          type="number"
          value={value ?? ''}
          min={inputValidation?.min}
          max={inputValidation?.max}
          step={getStep(field)}
          required={field.isRequired}
          disabled={disabled}
          aria-invalid={error !== undefined}
          aria-describedby={error === undefined ? undefined : errorId}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {field.type === 'Input' && field.suffix !== undefined && <Suffix>{field.suffix}</Suffix>}
      </Control>
      {error !== undefined && (
        <ErrorText id={errorId} role="alert">
          {error}
        </ErrorText>
      )}
    </FieldGridItem>
  );
}

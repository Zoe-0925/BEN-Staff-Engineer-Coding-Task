import type { Field } from '../schemas/Field';
import type { FieldValue } from '../schemas/FieldValue';

function hasMoreDecimalPlaces(value: number, maxDecimalPlaces: number): boolean {
  const scale = 10 ** maxDecimalPlaces;
  const scaledValue = value * scale;
  const tolerance = Number.EPSILON * Math.max(1, Math.abs(scaledValue));

  return Math.abs(scaledValue - Math.round(scaledValue)) > tolerance;
}

export function validateField(field: Field, value: FieldValue): string | undefined {
  if (value === null) {
    return field.isRequired ? field.requiredErrorMessage : undefined;
  }

  if (field.type === 'Input') {
    const isInvalid =
      typeof value !== 'number' ||
      !Number.isFinite(value) ||
      (field.validation.min !== undefined && value < field.validation.min) ||
      (field.validation.max !== undefined && value > field.validation.max) ||
      (field.validation.integer === true && !Number.isInteger(value)) ||
      (field.validation.maxDecimalPlaces !== undefined &&
        hasMoreDecimalPlaces(value, field.validation.maxDecimalPlaces));

    return isInvalid ? field.validation.errorMessage : undefined;
  }

  return undefined;
}

import type { FieldMetadata } from './FieldMetadata';

export type FormState = {
  values: FieldMetadata[];
  errors: Record<string, string | undefined>;
  touched: string[];
};

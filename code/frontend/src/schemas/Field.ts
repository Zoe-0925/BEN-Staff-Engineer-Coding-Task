import type { SelectOption } from './SelectOption';
import type { Validation } from './Validation';

export type Field = {
  name: string;
  label: string;
  width: {
    xs: number;
    md: number;
  };
  isRequired: boolean;
  requiredErrorMessage: string;
} & (
  | {
      type: 'Input';
      validation: Validation;
      prefix?: string;
      suffix?: string;
    }
  | {
      type: 'Select';
      placeholder?: string;
      options: SelectOption[];
    }
);

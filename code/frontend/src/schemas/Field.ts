import type { SelectOption } from './SelectOption';
import type { Validation } from './Validation';

export type Field = {
  type: 'Input' | 'Select';
  name: string;
  label: string;
  width: {
    xs: number;
    md: number;
  };
  isRequired: boolean;
  requiredErrorMessage: string;
  validation: Validation;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  options?: SelectOption[];
};

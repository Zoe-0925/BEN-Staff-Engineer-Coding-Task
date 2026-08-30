import type { FieldMetadata } from './FieldMetadata';

export type FormAction =
  | {
      type: 'UPDATE_FIELD';
      payload: FieldMetadata;
    }
  | {
      type: 'SET_FIELD_ERROR';
      payload: {
        name: string;
        error?: string;
      };
    }
  | {
      type: 'SET_FIELD_ERRORS';
      payload: Record<string, string | undefined>;
    };

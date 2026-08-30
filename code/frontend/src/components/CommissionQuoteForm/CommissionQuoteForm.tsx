import { useEffect, useReducer, type FormEvent } from 'react';

import type { ErrorResponse } from '../../schemas/CommissionQuoteDto';
import type { Field } from '../../schemas/Field';
import type { FieldMetadata } from '../../schemas/FieldMetadata';
import type { FormAction } from '../../schemas/FormAction';
import type { FormState } from '../../schemas/FormState';
import { Grid, GridItem } from '../../styles/Grid';
import { validateField } from '../../utils/validateField';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';

type CommissionQuoteFormProps = {
  fields: Field[];
  isLoading: boolean;
  apiFieldErrors?: ErrorResponse['error']['fieldErrors'];
  onSubmit: (values: FieldMetadata[]) => Promise<void>;
};

const FULL_WIDTH: Field['width'] = {
  xs: 12,
  md: 12,
};

function createInitialFormState(fields: Field[]): FormState {
  return {
    values: fields.map((field) => ({ name: field.name, value: undefined })),
    errors: {},
    touched: [],
  };
}

function validateForm(fields: Field[], values: FieldMetadata[]): FormState['errors'] {
  const errors: FormState['errors'] = {};

  for (const field of fields) {
    const value = values.find(({ name }) => name === field.name)?.value;
    errors[field.name] = validateField(field, value);
  }

  return errors;
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        values: state.values.map((field) =>
          field.name === action.payload.name ? action.payload : field,
        ),
      };
    case 'SET_FIELD_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.name]: action.payload.error,
        },
        touched: state.touched.includes(action.payload.name)
          ? state.touched
          : [...state.touched, action.payload.name],
      };
    case 'SET_FIELD_ERRORS':
      return {
        ...state,
        errors: action.payload,
        touched: Object.keys(action.payload),
      };
  }

  const exhaustiveAction: never = action;
  return exhaustiveAction;
}

export function CommissionQuoteForm({
  fields,
  isLoading,
  apiFieldErrors,
  onSubmit,
}: CommissionQuoteFormProps) {
  const [state, dispatch] = useReducer(formReducer, fields, createInitialFormState);
  const hasErrors = Object.values(state.errors).some(Boolean);

  useEffect(() => {
    if (apiFieldErrors !== undefined) {
      const fieldErrors: Record<string, string | undefined> = { ...apiFieldErrors };
      dispatch({ type: 'SET_FIELD_ERRORS', payload: fieldErrors });
    }
  }, [apiFieldErrors]);

  function handleFieldChange(field: FieldMetadata, error?: string) {
    dispatch({ type: 'UPDATE_FIELD', payload: field });

    if (state.errors[field.name] !== undefined) {
      dispatch({
        type: 'SET_FIELD_ERROR',
        payload: { name: field.name, error },
      });
    }
  }

  function handleFieldBlur(name: string, error?: string) {
    dispatch({ type: 'SET_FIELD_ERROR', payload: { name, error } });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fieldErrors = validateForm(fields, state.values);

    dispatch({ type: 'SET_FIELD_ERRORS', payload: fieldErrors });

    if (Object.values(fieldErrors).some(Boolean)) {
      return;
    }

    void onSubmit(state.values);
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <Grid>
        {fields.map((field) => {
          const fieldValue = state.values.find(({ name }) => name === field.name)?.value;
          const error = state.errors[field.name];

          switch (field.type) {
            case 'Input':
              return (
                <Input
                  key={field.name}
                  field={field}
                  value={typeof fieldValue === 'number' ? fieldValue : undefined}
                  error={error}
                  disabled={isLoading}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                />
              );
            case 'Select':
              return (
                <Select
                  key={field.name}
                  field={field}
                  value={typeof fieldValue === 'string' ? fieldValue : undefined}
                  error={error}
                  disabled={isLoading}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                />
              );
          }

          const exhaustiveField: never = field;
          return exhaustiveField;
        })}
        <GridItem $width={FULL_WIDTH}>
          <Button
            type="submit"
            label="Generate quote"
            loadingLabel="Generating quote..."
            isLoading={isLoading}
            disabled={hasErrors}
          />
        </GridItem>
      </Grid>
    </form>
  );
}

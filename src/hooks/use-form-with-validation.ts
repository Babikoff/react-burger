import { useState } from 'react';

import { getValidators } from '../utils/validators';

import type { IValidators } from '../utils/validators';

interface IValues {
  name?: string;
  email?: string;
  password?: string;
}

interface IErrors {
  name?: boolean;
  email?: boolean;
  password?: boolean;
}

interface IUseFormWithValidation {
  values: IValues;
  setValues: React.Dispatch<React.SetStateAction<IValues>>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: IErrors;
  isValid: boolean;
}

export function useFormWithValidation(
  initialValues: IValues = {},
  allowEmptyPassword: boolean
): IUseFormWithValidation {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initErrors(initialValues));
  const [isValid, setIsValid] = useState(false);
  const myValidators = getValidators(allowEmptyPassword);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const input = event.target;
    const value = input.value;
    const name = input.name as keyof IValidators;

    const newValues = {
      ...values,
      [name]: value,
    };

    setValues(newValues);

    const newErrors = {
      ...errors,
      [name]: myValidators[name]?.validator(value) ?? true,
    };

    setErrors(newErrors);

    const formIsNotValid = Object.values(newErrors).some((x) => !x);
    setIsValid(!formIsNotValid);
  }

  return { values, setValues, handleChange, errors, isValid };
}

function initErrors(formValues: IValues): IErrors {
  return Object.keys(formValues).reduce((errors: IErrors, fieldName) => {
    errors[fieldName as keyof IErrors] = false;
    return errors;
  }, {} as IErrors);
}

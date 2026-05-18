import { useState } from 'react';

import { getValidators } from '../utils/validators';

export function useFormWithValidation(initialValues = {}, allowEmptyPassword) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initErrors(initialValues));
  const [isValid, setIsValid] = useState(false);
  const myValidators = getValidators(allowEmptyPassword);

  function handleChange(event) {
    const input = event.target;
    const value = input.value;
    const name = input.name;

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

function initErrors(formValues) {
  return Object.keys(formValues).reduce((errors, fieldName) => {
    errors[fieldName] = false;
    return errors;
  }, {});
}

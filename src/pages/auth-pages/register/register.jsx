import {
  EmailInput,
  Input,
  PasswordInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useRegisterMutation } from '@services/api';

import { useFormWithValidation } from '../../../hooks/use-form-with-validation';
import { getValidators } from '../../../utils/validators';

import globalStyles from '../../../global.module.css';
import commonAuthStyles from '../auth-pages-common.module.css';

export const RegisterPage = () => {
  const inputRef = useRef(null);
  const [register, { isLoading, error }] = useRegisterMutation();
  const [response, setResponse] = useState(null);

  const validators = getValidators(false);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const { values, handleChange, errors, isValid } = useFormWithValidation({
    name: '',
    email: '',
    password: '',
  });

  function handleSubmit(event) {
    event.preventDefault();
    setResponse(register(values));
  }

  return (
    <>
      <main className={commonAuthStyles.page}>
        <div className={commonAuthStyles.container}>
          <h2 className="text text_type_main-medium">Регистрация</h2>
          <form className={`mt-6 ${commonAuthStyles.form}`} onSubmit={handleSubmit}>
            <div className="mb-6">
              <Input
                id="name"
                ref={inputRef}
                type="text"
                name="name"
                placeholder="Имя"
                value={values.name || ''}
                onChange={handleChange}
                aria-invalid={!!errors.name}
              />
            </div>
            <div className="mb-6">
              <EmailInput
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={values.email || ''}
                errorText={validators.email.message}
                onChange={handleChange}
                aria-invalid={!!errors.email}
              />
            </div>
            <div className="mb-6">
              <PasswordInput
                type="password"
                name="password"
                id="password"
                placeholder="Пароль"
                value={values.password || ''}
                errorText={validators.password.message}
                onChange={handleChange}
                aria-invalid={!!errors.password}
              />
            </div>
            <Button disabled={isLoading || !isValid}>
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>
          {error && (
            <span
              className={`${commonAuthStyles.error} text_type_main-default mt-1`}
            >{`Ошибка: ${error.message}`}</span>
          )}
          {response && error === undefined && (
            <span className="text_type_main-default  mt-3">
              Вы успешно зарегистрировались!
            </span>
          )}
          <footer className={commonAuthStyles.footer}>
            <div className="text_type_main-default text_color_inactive">
              <span className="mr-2">Вы - новый пользователь?</span>
              <Link to="/login" className={globalStyles.link}>
                Вход
              </Link>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
};

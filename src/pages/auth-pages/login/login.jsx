import {
  EmailInput,
  PasswordInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useLoginMutation } from '@services/api';

import { useFormWithValidation } from '../../../hooks/use-form-with-validation';
import { validators } from '../../../utils/validators';

import globalStyles from '../../../global.module.css';
import commonAuthStyles from '../auth-pages-common.module.css';

export const LoginPage = () => {
  const inputRef = useRef(null);
  const [login, { isLoading, error }] = useLoginMutation();
  const [response, setResponse] = useState(null);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const { values, handleChange, errors, isValid } = useFormWithValidation({
    email: '',
  });

  function handleSubmit(event) {
    event.preventDefault();
    setResponse(login(values));
  }

  return (
    <>
      <main className={commonAuthStyles.page}>
        <div className={commonAuthStyles.container}>
          <h2 className="text text_type_main-medium">Вход</h2>
          <form className={`mt-6 ${commonAuthStyles.form}`} onSubmit={handleSubmit}>
            <div className="mb-6">
              <EmailInput
                id="email"
                ref={inputRef}
                type="email"
                name="email"
                placeholder="Email"
                value={values.email || ''}
                error={errors.email}
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
                error={errors.password}
                onChange={handleChange}
                errorText={validators.password.message}
                aria-invalid={!!errors.password}
              />
            </div>
            <Button disabled={isLoading || !isValid}>
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
          {error && (
            <span
              className={`${commonAuthStyles.error} text_type_main-default mt-1`}
            >{`Ошибка: ${error.message}`}</span>
          )}
          {response && error === undefined && (
            <span className="text_type_main-default  mt-3">Вы успешно вошли!</span>
          )}
          <footer className={commonAuthStyles.footer}>
            <div className="text_type_main-default text_color_inactive">
              <span className="mr-2">Вы - новый пользователь?</span>
              <Link to="/register" className={globalStyles.link}>
                Зарегистрироваться
              </Link>
            </div>
            <div className="text_type_main-default text_color_inactive">
              <span className="mr-2">Забыли пароль?</span>
              <Link to="/forgot-password" className={globalStyles.link}>
                Восстановить пароль
              </Link>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
};

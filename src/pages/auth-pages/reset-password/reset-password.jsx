import {
  Input,
  PasswordInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useLayoutEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useSetNewPasswordMutation } from '@services/api';

import { useFormWithValidation } from '../../../hooks/use-form-with-validation';
import { getValidators } from '../../../utils/validators';

import globalStyles from '../../../global.module.css';
import commonAuthStyles from '../auth-pages-common.module.css';

export const ResetPasswordPage = () => {
  const inputRef = useRef(null);
  const [setNewPassword, { isLoading, error }] = useSetNewPasswordMutation();

  const validators = getValidators(false);

  const location = useLocation();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!location.state?.resetPassword) {
      navigate('/forgot-password', { state: { resetPassword: false } });
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const { values, handleChange, errors, isValid } = useFormWithValidation({
    token: '',
  });

  async function handleSubmit(event) {
    event.preventDefault();

    const result = await setNewPassword(values);
    if (result.error) {
      console.log(
        `Reset password failed. Error: ${result.error.data?.message || result.error.message}`
      );
    } else {
      console.log('Navigate to /login');
      navigate('/login');
    }
  }

  return (
    <>
      <main className={commonAuthStyles.page}>
        <div className={commonAuthStyles.container}>
          <h2 className="text text_type_main-medium">Вход</h2>
          <form className={`mt-6 ${commonAuthStyles.form}`} onSubmit={handleSubmit}>
            <div className="mb-6">
              <PasswordInput
                id="password"
                ref={inputRef}
                type="password"
                name="password"
                placeholder="Новый пароль"
                value={values.password || ''}
                errorText={validators.password.message}
                onChange={handleChange}
                aria-invalid={!!errors.password}
              />
            </div>
            <div className="mb-6">
              <Input
                id="token"
                type="text"
                name="token"
                placeholder="Введите код из письма"
                value={values.token || ''}
                onChange={handleChange}
              />
            </div>
            <Button disabled={isLoading || !isValid}>Сохранить</Button>
          </form>
          {error && (
            <span
              className={`${commonAuthStyles.error} text_type_main-default mt-1`}
            >{`Ошибка: ${error.message}`}</span>
          )}
          <footer className={commonAuthStyles.footer}>
            <div className="text_type_main-default text_color_inactive">
              <span className="mr-2">Вспомнили пароль?</span>
              <Link to="/login" className={globalStyles.link}>
                Войти
              </Link>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
};

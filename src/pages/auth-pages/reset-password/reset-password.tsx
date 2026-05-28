import {
  Input,
  PasswordInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { type JSX, useLayoutEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useSetNewPasswordMutation } from '@services/api';

import { useFormWithValidation } from '../../../hooks/use-form-with-validation';
import { getValidators } from '../../../utils/validators';

import globalStyles from '../../../global.module.css';
import commonAuthStyles from '../auth-pages-common.module.css';

export const ResetPasswordPage = (): JSX.Element => {
  const [setNewPassword, { isLoading, error }] = useSetNewPasswordMutation();

  const validators = getValidators(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useState('');

  useLayoutEffect(() => {
    if (!location.state?.resetPassword) {
      navigate('/forgot-password', { state: { resetPassword: false } });
    }
  }, []);

  const { values, handleChange, errors, isValid } = useFormWithValidation(
    {
      password: '',
    },
    false
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!values.password) {
      console.log('The password value is empty.');
      return;
    }

    if (!token) {
      console.log('The token value is empty.');
      return;
    }

    const result = await setNewPassword({ token: token, password: values.password });
    if (result.error) {
      console.log(`Reset password failed. Error: ${result.error.message}`);
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
                name="password"
                placeholder="Новый пароль"
                value={values.password || ''}
                errorText={validators.password.message}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                autoFocus
              />
            </div>
            <div className="mb-6">
              <Input
                id="token"
                type="text"
                name="token"
                placeholder="Введите код из письма"
                value={token || ''}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
            <Button htmlType="submit" disabled={isLoading || !isValid}>
              Сохранить
            </Button>
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

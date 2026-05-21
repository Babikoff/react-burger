import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useLayoutEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { usePasswordResetMutation } from '@services/api';

import { useFormWithValidation } from '../../../hooks/use-form-with-validation';
import { getValidators } from '../../../utils/validators';

import globalStyles from '../../../global.module.css';
import commonAuthStyles from '../auth-pages-common.module.css';

export const ForgotPasswordPage = () => {
  const inputRef = useRef(null);
  const [passwordReset, { isLoading, error }] = usePasswordResetMutation();
  const navigate = useNavigate();

  const validators = getValidators(false);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const { values, handleChange, errors, isValid } = useFormWithValidation({
    email: '',
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await passwordReset(values);

    if (result.error) {
      console.log(
        `Reset password failed. Error: ${result.error.data?.message || result.error.message}`
      );
    } else {
      console.log('Navigate to /reset-password');
      navigate('/reset-password', { state: { replace: true, resetPassword: true } });
    }
  }

  return (
    <>
      <main className={commonAuthStyles.page}>
        <div className={commonAuthStyles.container}>
          <h2 className="text text_type_main-medium">Восстановление пароля</h2>
          <form className={`mt-6 ${commonAuthStyles.form}`} onSubmit={handleSubmit}>
            <div className="mb-6">
              <EmailInput
                id="email"
                ref={inputRef}
                type="email"
                name="email"
                placeholder="Email"
                value={values.email || ''}
                errorText={validators.email.message}
                onChange={handleChange}
                aria-invalid={!!errors.email}
              />
            </div>
            <Button disabled={isLoading || !isValid}>Восстановить</Button>
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

import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';

import { usePasswordResetMutation } from '@services/api';

import { useFormWithValidation } from '../../../hooks/use-form-with-validation';
import { getValidators } from '../../../utils/validators';

import type { JSX } from 'react';

import globalStyles from '../../../global.module.css';
import commonAuthStyles from '../auth-pages-common.module.css';

export const ForgotPasswordPage = (): JSX.Element => {
  const [passwordReset, { isLoading, error }] = usePasswordResetMutation();
  const navigate = useNavigate();

  const validators = getValidators(false);

  const { values, handleChange, errors, isValid } = useFormWithValidation(
    {
      email: '',
    },
    false
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const result = await passwordReset({
      email: values.email ?? '',
    });

    if (result.error) {
      console.log(`Reset password failed. Error: ${result.error.message}`);
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
                name="email"
                placeholder="Email"
                value={values.email || ''}
                errorText={validators.email.message}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                autoFocus
              />
            </div>
            <Button htmlType="submit" disabled={isLoading || !isValid}>
              Восстановить
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

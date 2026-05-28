import {
  EmailInput,
  Input,
  PasswordInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';

import { useRegisterMutation } from '@services/api';

import { useFormWithValidation } from '../../../hooks/use-form-with-validation';
import { getValidators } from '../../../utils/validators';

import type { JSX } from 'react';

import globalStyles from '../../../global.module.css';
import commonAuthStyles from '../auth-pages-common.module.css';

export const RegisterPage = (): JSX.Element => {
  const [register, { isLoading, error }] = useRegisterMutation();

  const validators = getValidators(false);
  const navigate = useNavigate();

  const { values, handleChange, errors, isValid } = useFormWithValidation(
    {
      name: '',
      email: '',
      password: '',
    },
    false
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const result = await register({
      name: values.name ?? '',
      email: values.email ?? '',
      password: values.password ?? '',
    });

    if (result.error) {
      console.log(`Registration failed. Error: ${result.error.message}`);
    } else {
      console.log('Navigate to /');
      navigate('/');
    }
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
                type="text"
                name="name"
                placeholder="Имя"
                value={values.name || ''}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                autoFocus
              />
            </div>
            <div className="mb-6">
              <EmailInput
                id="email"
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
                name="password"
                id="password"
                placeholder="Пароль"
                value={values.password || ''}
                errorText={validators.password.message}
                onChange={handleChange}
                aria-invalid={!!errors.password}
              />
            </div>
            <Button htmlType="submit" disabled={isLoading || !isValid}>
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>
          {error && (
            <span
              className={`${commonAuthStyles.error} text_type_main-default mt-1`}
            >{`Ошибка: ${error.message}`}</span>
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

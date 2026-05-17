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
import { validators } from '../../../utils/validators';

import globalStyles from '../../../global.module.css';
import styles from './profile.module.css';

export const Profile = () => {
  const inputRef = useRef(null);
  const [register, { isLoading, error }] = useRegisterMutation();
  const [response, setResponse] = useState(null);

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
      <main className={styles.page}>
        <div className={styles.container}>
          <form className={`mt-6 ${styles.form}`} onSubmit={handleSubmit}>
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
                name="email"
                placeholder="Логин"
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
            <section className={styles.buttonsSection}>
              <Button disabled={isLoading || !isValid}>Сохранить</Button>
              <Button disabled={isLoading || !isValid}>Отмена</Button>
            </section>
          </form>
          {error && (
            <span
              className={`${styles.error} text_type_main-default mt-1`}
            >{`Ошибка: ${error.message}`}</span>
          )}
          {response && error === undefined && (
            <span className="text_type_main-default  mt-3">
              Вы успешно зарегистрировались!
            </span>
          )}
          <footer className={styles.footer}>
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

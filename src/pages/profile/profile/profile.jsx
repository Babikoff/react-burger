import {
  EmailInput,
  Input,
  PasswordInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useGetUserQuery, useSetUserMutation } from '@services/api';

import { getValidators } from '../../../utils/validators';

import styles from './profile.module.css';

export const Profile = () => {
  const inputRef = useRef(null);

  const { data, isLoading } = useGetUserQuery();

  const user = useMemo(() => data, [data]);

  const [setUser, { isLoading: isUpdatingUser, error: errorUpdatingUser }] =
    useSetUserMutation();

  const [response, setResponse] = useState(null);

  const validators = getValidators(true);
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
  });

  const isValid = useMemo(
    () =>
      validators.name.validator(values.name) &&
      validators.email.validator(values.email) &&
      validators.password.validator(values.password),
    [values, validators]
  );

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (user && !initialValues) {
      const vals = {
        name: user.name || '',
        email: user.email || '',
        password: '',
      };
      setInitialValues(vals);
      setValues(vals);
    }
  }, [user, initialValues, setValues]);

  const isDataChanged = useMemo(() => {
    // Если начальное состояние ещё даже не установлено,
    // заявляем что у нас ни чего пока не менялось
    if (!initialValues) return false;

    return (
      initialValues.name !== (values.name || '') ||
      initialValues.email !== (values.email || '') ||
      (values.password || '') !== ''
    );
  }, [initialValues, values]);

  const handleCancel = useCallback(() => {
    if (initialValues) {
      setValues(initialValues);
    }
  }, [initialValues, setValues]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setResponse(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const result = await setUser(values).unwrap();
      console.log(result);
      setResponse(result);
      values.password = '';
      setInitialValues(values);
    } catch {
      setResponse(null);
    }
  }

  return (
    <>
      <main className={styles.page}>
        <div className={styles.container}>
          <form
            className={`mt-6 ${styles.form}`}
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div className="mb-6">
              <Input
                id="name"
                ref={inputRef}
                type="text"
                name="name"
                placeholder="Имя"
                value={values.name || ''}
                onChange={handleChange}
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
                autoComplete="new-password"
              />
            </div>
            <section className={styles.buttonsSection}>
              <Button
                disabled={isUpdatingUser || isLoading || !isValid || !isDataChanged}
              >
                Сохранить
              </Button>
              <Button
                disabled={isUpdatingUser || isLoading || !isDataChanged}
                onClick={handleCancel}
              >
                Отмена
              </Button>
            </section>
          </form>
          {errorUpdatingUser && (
            <span
              className={`${styles.error} text_type_main-default mt-1`}
            >{`Ошибка: ${errorUpdatingUser.message}`}</span>
          )}
          {response && errorUpdatingUser === undefined && (
            <span className="text_type_main-default  mt-3">Данные обновлены</span>
          )}
        </div>
      </main>
    </>
  );
};

import { EmailInput, Input, Button } from '@krgaa/react-developer-burger-ui-components';
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

  // Состояния полей редактирования
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);

  // Информационное сообщение о статусе процесса
  const [footerMessage, setFooterMessage] = useState('');

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
    setIsNameEditing(false);
    setIsEmailEditing(false);
    setIsPasswordEditing(false);
    setFooterMessage('Изменения отменены');
  }, [initialValues, setValues]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setFooterMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await setUser(values).unwrap();
    values.password = '';
    setInitialValues(values);
    setIsNameEditing(false);
    setIsEmailEditing(false);
    setIsPasswordEditing(false);
    setFooterMessage('Данные обновлены');
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
                name="name"
                placeholder="Имя"
                value={values.name || ''}
                onChange={handleChange}
                icon={isNameEditing ? undefined : 'EditIcon'}
                onIconClick={() => setIsNameEditing((prev) => !prev)}
                disabled={!isNameEditing}
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
                icon={isEmailEditing ? undefined : 'EditIcon'}
                onIconClick={() => setIsEmailEditing((prev) => !prev)}
                disabled={!isEmailEditing}
              />
            </div>
            <div className="mb-6">
              <Input
                name="password"
                id="password"
                placeholder="Пароль"
                value={values.password || ''}
                errorText={validators.password.message}
                onChange={handleChange}
                icon={isPasswordEditing ? undefined : 'EditIcon'}
                onIconClick={() => setIsPasswordEditing((prev) => !prev)}
                disabled={!isPasswordEditing}
                autoComplete="new-password"
              />
            </div>
            <section className={styles.buttonsSection}>
              <Button
                visible={!(isUpdatingUser || isLoading || !isValid || !isDataChanged)}
                type="primary"
                htmlType="submit"
              >
                Сохранить
              </Button>
              <Button
                visible={!(isUpdatingUser || isLoading || !isDataChanged)}
                onClick={handleCancel}
                type="secondary"
                htmlType="button"
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
          {footerMessage && errorUpdatingUser === undefined && (
            <span className="text_type_main-default  mt-3">{footerMessage}</span>
          )}
        </div>
      </main>
    </>
  );
};

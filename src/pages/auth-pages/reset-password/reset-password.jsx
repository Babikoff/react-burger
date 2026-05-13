import {
  Input,
  PasswordInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import globalStyles from '../../../global.module.css';
import styles from '../auth-pages-common.module.css';

export const ResetPasswordPage = () => {
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <>
      <main className={styles.page}>
        <div className={styles.container}>
          <h2 className="text text_type_main-medium">Вход</h2>
          <form className={`mt-6 ${styles.form}`} onSubmit={handleSubmit}>
            <div className="mb-6">
              <PasswordInput placeholder="Введите новый пароль" />
            </div>
            <div className="mb-6">
              <Input placeholder="Введите код из письма" />
            </div>
            <Button>Сохранить</Button>
          </form>
          <footer className={styles.footer}>
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

import {
  EmailInput,
  PasswordInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import globalStyles from '../../../global.module.css';
import styles from '../auth-pages-common.module.css';

export const LoginPage = () => {
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
              <EmailInput />
            </div>
            <div className="mb-6">
              <PasswordInput />
            </div>
            <Button>Войти</Button>
          </form>
          <footer className={styles.footer}>
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

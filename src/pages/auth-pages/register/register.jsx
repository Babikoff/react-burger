import {
  EmailInput,
  Input,
  PasswordInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import globalStyles from '../../../global.module.css';
import styles from '../auth-pages-common.module.css';

export const RegisterPage = () => {
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <>
      <main className={styles.page}>
        <div className={styles.container}>
          <h2 className="text text_type_main-medium">Регистрация</h2>
          <form className={`mt-6 ${styles.form}`} onSubmit={handleSubmit}>
            <div className="mb-6">
              <Input placeholder="Имя" />
            </div>
            <div className="mb-6">
              <EmailInput />
            </div>
            <div className="mb-6">
              <PasswordInput />
            </div>
            <Button>Зарегистрироваться</Button>
          </form>
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

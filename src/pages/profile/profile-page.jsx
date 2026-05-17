import { NavLink, Outlet, useMatch } from 'react-router-dom';

import { useLogoutMutation } from '@services/api';

import styles from './profile-page.module.css';

export const ProfilePage = () => {
  const [logout] = useLogoutMutation();

  function onLogoutClick() {
    logout();
  }

  const isOrdersActive = !!useMatch('/profile/orders');
  const isProfileActive = !!(useMatch('/profile') && !isOrdersActive);

  const navLinkClass = `${styles.navigationMenuLink} text_color_inactive text_type_main-medium`;
  const activeNavLinkClass = `${styles.navigationMenuLink} ${styles.activeMenuLink} text_type_main-medium`;

  return (
    <>
      <main className={`${styles.page} ml-6`}>
        <section className={`${styles.navigationBlock} mt-6`}>
          <nav>
            <div className={styles.navigationMenu}>
              <NavLink
                to="/profile"
                className={`${isProfileActive ? activeNavLinkClass : navLinkClass}`}
              >
                Профиль
              </NavLink>
              <NavLink
                to="/profile/orders"
                className={`${isOrdersActive ? activeNavLinkClass : navLinkClass}`}
              >
                История заказов
              </NavLink>
              <NavLink onClick={onLogoutClick} className={`${navLinkClass}`}>
                Выход
              </NavLink>
            </div>
          </nav>
          <footer className={`text_type_main-default text_color_inactive mt-20`}>
            {isProfileActive &&
              'В этом разделе вы можете изменить свои персональные данные'}
            {isOrdersActive &&
              'В этом разделе вы можете посмотреть свою историю заказов'}
          </footer>
        </section>
        <Outlet />
      </main>
    </>
  );
};

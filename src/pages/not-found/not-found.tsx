import pageNotFound from '../../images/404.svg';

import type { JSX } from 'react';

import styles from './not-found.module.css';

export const NotFoundPage = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img alt="Страница не найдена" src={pageNotFound} />
        <br />
      </div>
    </div>
  );
};

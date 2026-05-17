import pageNotFound from '../../images/404.svg';

import styles from './not-found.module.css';

export const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img alt="page not found" src={pageNotFound} />
        <br />
      </div>
    </div>
  );
};

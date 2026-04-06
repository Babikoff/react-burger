import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import ModalOverlay from '../modal-overlay/modal-overlay.jsx';

import styles from './modal.module.css';

const modalRoot = document.getElementById('modal');

function Modal({ header, closeModal, children }) {
  useEffect(() => {
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  function handleEscKey(event) {
    event.stopPropagation();
    if (event.key === 'Escape') closeModal();
  }

  return ReactDOM.createPortal(
    <>
      <div className={styles.modal_window}>
        <div className={styles.header}>
          <h3 className={`text text_type_main-large`}>{header}</h3>
          <CloseIcon onClick={closeModal} styles={{ width: '18px', height: '18px' }} />
        </div>
        <div className={styles.modal_content}>{children}</div>
      </div>
      <ModalOverlay closeModal={closeModal} />
    </>,
    modalRoot
  );
}

export default Modal;

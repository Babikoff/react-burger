import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, type JSX } from 'react';
import ReactDOM from 'react-dom';

import ModalOverlay from '../modal-overlay/modal-overlay.tsx';

import styles from './modal.module.css';

const modalRoot = document.getElementById('modal')!;

interface IModalProps {
  header: string;
  closeModal: () => void;
  children: React.ReactNode;
}

function Modal({ header, closeModal, children }: IModalProps): JSX.Element {
  useEffect(() => {
    document.addEventListener('keydown', handleEscKey);
    return (): void => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  function handleEscKey(this: Document, event: KeyboardEvent): void {
    event.stopPropagation();
    if (event.key === 'Escape') closeModal();
  }

  return ReactDOM.createPortal(
    <>
      <div className={styles.modal_window}>
        <div className={styles.header}>
          <h3 className={`text text_type_main-large`}>{header}</h3>
          <CloseIcon onClick={closeModal} type="secondary" />
        </div>
        <div className={styles.modal_content}>{children}</div>
      </div>
      <ModalOverlay closeModal={closeModal} />
    </>,
    modalRoot
  );
}

export default Modal;

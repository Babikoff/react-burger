import type { JSX } from 'react';

import styles from './modal-overlay.module.css';

interface IModalOverlay {
  closeModal: () => void;
}

function ModalOverlay({ closeModal }: IModalOverlay): JSX.Element {
  return <div className={styles.modal_overlay} onClick={closeModal} />;
}

export default ModalOverlay;

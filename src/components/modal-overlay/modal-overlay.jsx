import styles from './modal-overlay.module.css';

function ModalOverlay({ closeModal }) {
  return <div className={styles.modal_overlay} onClick={closeModal} />;
}

export default ModalOverlay;

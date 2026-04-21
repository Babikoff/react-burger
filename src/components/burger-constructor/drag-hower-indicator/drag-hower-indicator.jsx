import styles from './drag-hower-indicator.module.css';

function DragHowerIndicator({ isHover, className, children }) {
  return (
    <div className={`${className} ${isHover && styles.indicate_can_drop}`}>
      {children}
    </div>
  );
}

export default DragHowerIndicator;

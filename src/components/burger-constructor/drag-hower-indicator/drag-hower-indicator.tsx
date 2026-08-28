import type { JSX } from 'react';

import styles from './drag-hower-indicator.module.css';

interface IDragHowerIndicatorProps {
  isHover: boolean;
  className: string;
  children: React.ReactNode;
}

function DragHowerIndicator({
  isHover,
  className,
  children,
}: IDragHowerIndicatorProps): JSX.Element {
  return (
    <div className={`${className} ${isHover && styles.indicate_can_drop}`}>
      {children}
    </div>
  );
}

export default DragHowerIndicator;

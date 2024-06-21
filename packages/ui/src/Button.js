'use client';

import styles from './Button.module.css';

const Button = ({ children, type, onClick }) => {
  return (
    <button type={type} className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;

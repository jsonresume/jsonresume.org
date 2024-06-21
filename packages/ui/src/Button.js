'use client';

import styles from './Button.module.css';

const Button = ({ children, type, onClick, disabled }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={styles.button}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

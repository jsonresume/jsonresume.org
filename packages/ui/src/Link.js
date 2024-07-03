import styles from './Link.module.css';
import Link from 'next/link';

const LinkContainer = ({ children, href = '#', onClick, style, target }) => {
  return (
    <Link
      className={styles.link}
      href={href}
      onClick={onClick}
      style={style}
      target={target}
    >
      {children}
    </Link>
  );
};

export default LinkContainer;

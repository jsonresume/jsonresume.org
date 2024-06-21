import styles from './Link.module.css';

const Link = ({ children, href, onClick }) => {
  return (
    <a className={styles.link} href={href} onClick={onClick}>
      {children}
    </a>
  );
};

export default Link;

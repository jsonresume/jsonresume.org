import styles from './Link.module.css';

const Link = ({ children, href, onClick, style, target }) => {
  return (
    <a
      className={styles.link}
      href={href}
      onClick={onClick}
      style={style}
      target={target}
    >
      {children}
    </a>
  );
};

export default Link;

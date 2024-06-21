import styles from './Header.module.css';

// #fff18f

const Header = ({ left = null, right = null }) => {
  return (
    <nav className={styles.header}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <div>{left}</div>
        <div>{right}</div>
      </div>
    </nav>
  );
};

export default Header;

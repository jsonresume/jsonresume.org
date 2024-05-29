const Header = ({ left = null, right = null }) => {
  return (
    <header>
      <nav>
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
    </header>
  );
};

export default Header;

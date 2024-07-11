import React from 'react';

const Header = ({ left = null, right = null }) => {
  return (
    <nav className="bg-yellow-200 p-2">
      <div className="flex flex-row justify-between">
        <div>{left}</div>
        <div>{right}</div>
      </div>
    </nav>
  );
};

export default Header;

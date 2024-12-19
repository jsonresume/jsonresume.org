import React from 'react';

const Header = ({ left = null, right = null }) => {
  return (
    <nav className="bg-yellow-200">
      <div className="w-full lg:flex lg:justify-between lg:items-center">
        {left}
        {right}
      </div>
    </nav>
  );
};

export default Header;

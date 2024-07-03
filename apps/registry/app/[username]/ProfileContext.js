import React, { createContext, useContext } from 'react';

const LayoutContext = createContext();

export const ProfileProvider = ({ children, resume, username, session }) => {
  const data = { resume, username, session };
  return (
    <LayoutContext.Provider value={data}>{children}</LayoutContext.Provider>
  );
};

export const useProfileData = () => {
  return useContext(LayoutContext);
};

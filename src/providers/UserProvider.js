import React, {createContext, useContext, useState} from 'react';

const Settings = createContext({
  userData: {},
  setUserData: () => {},
});

const useUserProvider = () => {
  const value = useContext(Settings);
  return value;
};

const UserProvider = ({children}) => {
  const [userData, setUserData] = useState({});

  return (
    <Settings.Provider
      value={{
        userData,
        setUserData,
      }}>
      {children}
    </Settings.Provider>
  );
};

export {useUserProvider, UserProvider};

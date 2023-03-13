import React, {createContext, useContext, useState} from 'react';

const Settings = createContext({
  isToken: '',
  setIsToken: () => {},
});

const useAuthProvider = () => {
  const value = useContext(Settings);
  return value;
};

const AuthProvider = ({children}) => {
  const [isToken, setIsToken] = useState('');

  return (
    <Settings.Provider
      value={{
        isToken,
        setIsToken,
      }}>
      {children}
    </Settings.Provider>
  );
};

export {useAuthProvider, AuthProvider};

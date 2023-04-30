import React, {createContext, useContext, useState} from 'react';

const Settings = createContext({
  langData: '',
  setLangData: () => {},
});

const useLangProvider = () => {
  const value = useContext(Settings);
  return value;
};

const LangProvider = ({children}) => {
  const [langData, setLangData] = useState('');

  return (
    <Settings.Provider
      value={{
        langData,
        setLangData,
      }}>
      {children}
    </Settings.Provider>
  );
};

export {useLangProvider, LangProvider};

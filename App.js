import React from 'react';
import RootNavigation from './src/navigations/RootNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {UserProvider} from './src/providers/UserProvider';
import {LangProvider} from './src/providers/LangProvider';

const App = () => {
  return (
    <UserProvider>
      <LangProvider>
        <SafeAreaProvider>
          <RootNavigation />
        </SafeAreaProvider>
      </LangProvider>
    </UserProvider>
  );
};

export default App;

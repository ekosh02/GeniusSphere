import React from 'react';
import RootNavigation from './src/navigations/RootNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {UserProvider} from './src/providers/UserProvider';

const App = () => {
  return (
    <UserProvider>
      <SafeAreaProvider>
        <RootNavigation />
      </SafeAreaProvider>
    </UserProvider>
  );
};

export default App;

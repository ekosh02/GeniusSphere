import React from 'react';
import RootNavigation from './src/navigations/RootNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './src/providers/AuthProvider';

const App = () => {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <RootNavigation />
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App;

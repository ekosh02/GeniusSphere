import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {APP_ROUTES} from '../constants/routes';
import SplashScreen from '../screens/launch/SplashScreen';
import BottomNavigation from './BottomNavigation';

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  const routes = [
    {
      name: APP_ROUTES.SPLASH_SCREEN,
      component: SplashScreen,
    },
    {
      name: APP_ROUTES.BOTTOM_TAB,
      component: BottomNavigation,
    },
  ];

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={APP_ROUTES.SPLASH_SCREEN}
        screenOptions={{
          headerShown: false,
        }}>
        {routes.map(route => (
          <Stack.Screen
            key={route.name}
            name={route.name}
            component={route.component}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {APP_ROUTES} from '../constants/routes';
import SplashScreen from '../screens/launch/SplashScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUnScreen from '../screens/auth/SignUnScreen';
import BottomNavigation from './BottomNavigation';
import {useAuthProvider} from '../providers/AuthProvider';
import {getStorage} from '../utils/AsyncStorage';
import {APP_KEYS} from '../constants/keys';
import Viewer from '../components/views/Viewer';
import RequestScreen from '../screens/tabs/bottoms/profile/menu/RequestScreen';

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  const [loading, setLoading] = useState(false);
  const {setIsToken} = useAuthProvider();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const token = await getStorage(APP_KEYS.TOKEN);
    if (token) {
      setIsToken(token);
    }
    setLoading(false);
  };

  const routes = [
    {
      name: APP_ROUTES.SPLASH_SCREEN,
      component: SplashScreen,
    },
    {
      name: APP_ROUTES.SIGN_IN_SCREEN,
      component: SignInScreen,
    },
    {
      name: APP_ROUTES.SIGN_UP_SCREEN,
      component: SignUnScreen,
    },
    {
      name: APP_ROUTES.BOTTOM_TAB,
      component: BottomNavigation,
    },
    {
      name: APP_ROUTES.REQUEST_SCREEN,
      component: RequestScreen,
    },
  ];

  return (
    <Viewer loader={loading}>
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
    </Viewer>
  );
};

export default RootNavigation;

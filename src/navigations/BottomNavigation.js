import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {FeedIcon, ProfileIcon, RequestIcon} from '../assets/icons';
import {APP_ROUTES} from '../constants/routes';
import FeedScreen from '../screens/tabs/bottoms/feed/FeedScreen';
import RequestScreen from '../screens/tabs/bottoms/request/RequestScreen';
import ProfileScreen from '../screens/tabs/bottoms/profile/ProfileScreen';

const Stack = createBottomTabNavigator();

const BottomNavigation = () => {
  const routes = [
    {
      name: APP_ROUTES.BOTTOM_TABS.FEED_SCREEN,
      component: FeedScreen,
      options: {
        tabBarIcon: ({focused}) => <FeedIcon active={focused} />,
      },
    },
    {
      name: APP_ROUTES.BOTTOM_TABS.REQUEST_SCREEN,
      component: RequestScreen,
      options: {
        tabBarIcon: ({focused}) => <RequestIcon active={focused} />,
      },
    },
    {
      name: APP_ROUTES.BOTTOM_TABS.PROFILE_SCREEN,
      component: ProfileScreen,
      options: {
        tabBarIcon: ({focused}) => <ProfileIcon active={focused} />,
      },
    },
  ];

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 86 : 56,
        },
      }}>
      {routes.map((route, index) => (
        <Stack.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={route.options}
        />
      ))}
    </Stack.Navigator>
  );
};

export default BottomNavigation;

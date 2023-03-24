import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {TaskIcon, ProfileIcon} from '../assets/icons';
import {APP_ROUTES} from '../constants/routes';
import TasksScreen from '../screens/tabs/bottoms/tasks/TasksScreen';
import ProfileScreen from '../screens/tabs/bottoms/profile/ProfileScreen';
import {useUserProvider} from '../providers/UserProvider';


const Stack = createBottomTabNavigator();

const BottomNavigation = () => {
  const {userData} = useUserProvider();

  const {role} = userData;

  const routes = [
    {
      name: APP_ROUTES.BOTTOM_TABS.TASKS_SCREEN,
      component: TasksScreen,
      options: {
        tabBarIcon: ({focused}) => <TaskIcon active={focused} />,
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

  const filteredRoutes = role === 1 ? routes.slice(1) : routes;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 86 : 56,
        },
      }}>
      {filteredRoutes.map((route, index) => (
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

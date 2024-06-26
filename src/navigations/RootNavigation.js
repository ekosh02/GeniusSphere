import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {APP_ROUTES} from '../constants/routes';
import SplashScreen from '../screens/launch/SplashScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUnScreen from '../screens/auth/SignUnScreen';
import BottomNavigation from './BottomNavigation';
import {useUserProvider} from '../providers/UserProvider';
import {getStorage, getStorageObject} from '../utils/AsyncStorage';
import {APP_KEYS} from '../constants/keys';
import Viewer from '../components/views/Viewer';
import RequestScreen from '../screens/tabs/bottoms/profile/menu/RequestScreen';
import TaskDetailsScreen from '../screens/tabs/bottoms/taskSupervisor/TaskDetailsScreen';
import NewTaskScreen from '../screens/tabs/bottoms/taskSupervisor/NewTaskScreen';
import NewAudienceScreen from '../screens/tabs/bottoms/audience/NewAudienceScreen';
import NewTaskTeacherScreen from '../screens/tabs/bottoms/taskTeacher/NewTaskTeacherScreen';
import TaskTeacherDetailsScreen from '../screens/tabs/bottoms/taskTeacher/TaskTeacherDetailsScreen';
import LanguageScreen from '../screens/tabs/bottoms/profile/menu/LanguageScreen';
import {useLangProvider} from '../providers/LangProvider';
import {strings} from '../languages/languages';
import GroupsScreen from '../screens/tabs/bottoms/profile/menu/GroupsScreen';
import CreateGroupsScreen from '../screens/tabs/bottoms/profile/menu/CreateGroupsScreen';

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  const [loading, setLoading] = useState(false);
  const {userData, setUserData} = useUserProvider();
  const {langData, setLangData} = useLangProvider();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const user = await getStorageObject(APP_KEYS.USER_DATA);
    const lang = await getStorage(APP_KEYS.LANG);
    if (user) {
      console.log('user', user);
      setUserData(user);
    }
    console.log('lang', lang);
    if (lang) {
      setLangData(lang);
      strings.setLanguage(lang);
    } else {
      setLangData('kz');
      strings.setLanguage('kz');
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
    {
      name: APP_ROUTES.TASK_DETAILS_SCREEN,
      component: TaskDetailsScreen,
    },
    {
      name: APP_ROUTES.NEW_TASK_SCREEN,
      component: NewTaskScreen,
    },
    {
      name: APP_ROUTES.NEW_AUDIENCE_SCREEN,
      component: NewAudienceScreen,
    },
    {
      name: APP_ROUTES.NEW_TASK_TEACHER_SCREEN,
      component: NewTaskTeacherScreen,
    },
    {
      name: APP_ROUTES.TASK_TASK_DETAILS_SCREEN,
      component: TaskTeacherDetailsScreen,
    },
    {
      name: APP_ROUTES.LANGUAGE_SCREEN,
      component: LanguageScreen,
    },
    {
      name: APP_ROUTES.GROUPS_SCREEN,
      component: GroupsScreen,
    },
    {
      name: APP_ROUTES.CREATE_GROUP_SCREEN,
      component: CreateGroupsScreen,
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

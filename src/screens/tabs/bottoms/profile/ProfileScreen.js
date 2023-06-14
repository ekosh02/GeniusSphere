import React, {useState} from 'react';
import Header from '../../../../components/bars/Header';
import Viewer from '../../../../components/views/Viewer';
import RowView from '../../../../components/views/RowView';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {WIDTH} from '../../../../constants/screenDimensions';
import {APP_COLORS} from '../../../../constants/colors';
import TextButton from '../../../../components/buttons/TextButton';
import {useUserProvider} from '../../../../providers/UserProvider';
import auth from '@react-native-firebase/auth';
import {APP_KEYS} from '../../../../constants/keys';
import {setStorageObject} from '../../../../utils/AsyncStorage';
import {APP_ROUTES} from '../../../../constants/routes';
import {setFontStyle} from '../../../../utils/setFontStyle';
import {ArrowGoIcon} from '../../../../assets/icons';
import {strings} from '../../../../languages/languages';

const ProfileScreen = props => {
  const {userData, setUserData} = useUserProvider();

  const [data, setData] = useState({
    collection: {},
    screenLoading: false,
    buttonLoading: false,
  });

  const menu = [
    {
      name: strings.Заявки,
      router: APP_ROUTES.REQUEST_SCREEN,
      show: userData.role === 2 || userData.role === 3 || userData.role === 4 ? true : false,
      params: null,
    },
    {
      name: strings['Поменять язык'],
      router: APP_ROUTES.LANGUAGE_SCREEN,
      show: true,
      params: null,
    },
    {
      name: strings.Группы,
      router: APP_ROUTES.GROUPS_SCREEN,
      show: true,
      params: null,
    },
  ];

  const onPressSignOut = () => {
    setData(prev => ({...prev, buttonLoading: true}));
    auth()
      .signOut()
      .then(async () => {
        await setStorageObject(APP_KEYS.USER_DATA, {});
        setUserData({});
        console.log('Signed out');
        setData(prev => ({...prev, buttonLoading: false}));
        props.navigation.reset({
          index: 0,
          routes: [{name: APP_ROUTES.SIGN_IN_SCREEN}],
        });
      })
      .catch(error => {
        if (error.code === 'auth/no-current-user') {
          Alert.alert(strings['Ни один пользователь не вошел в систему']);
          console.log('error', error.code);
          setData(prev => ({...prev, buttonLoading: false}));
          return;
        } else {
          console.log('error', error);
          setData(prev => ({...prev, buttonLoading: false}));
          return;
        }
      });
  };

  const onPressMenu = (routes, params) => {
    if (params) {
      props.navigation.navigate(routes, {params});
    } else {
      props.navigation.navigate(routes);
    }
  };

  return (
    <Viewer>
      <Header label={strings.Профиль} />
      <Viewer scroll bounces loader={data.screenLoading} style={styles.profile}>
        <RowView style={styles.avatarView}>
          <View style={styles.avator} />
          <View style={styles.avatorCol}>
            <Text style={styles.name} numberOfLines={1}>
              {userData.full_name}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {userData.email}
            </Text>
          </View>
        </RowView>
        {menu
          .filter(value => value.show)
          .map(value => (
            <TouchableOpacity
              style={styles.menuRow}
              activeOpacity={0.5}
              key={value.router}
              onPress={() => onPressMenu(value.router)}>
              <Text style={styles.menuText}>{value.name}</Text>
              <ArrowGoIcon />
            </TouchableOpacity>
          ))}
        <TextButton
          style={styles.signOut}
          label={strings.Выйти}
          size={22}
          loader={data.buttonLoading}
          onPress={onPressSignOut}
        />
      </Viewer>
      <View
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          bottom: 30,
          width: WIDTH,
        }}>
        <Text>{strings['Создано Yeldos Turapbayev']}</Text>
      </View>
    </Viewer>
  );
};

const styles = StyleSheet.create({
  profile: {
    backgroundColor: undefined,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarView: {
    height: 118,
    width: WIDTH,
    marginBottom: 16,
  },
  avator: {
    width: 86,
    height: 86,
    backgroundColor: APP_COLORS.PRIMARY,
    marginHorizontal: 16,
    borderRadius: 43,
  },
  avatorCol: {
    height: 64,
    justifyContent: 'space-evenly',
  },
  name: {
    ...setFontStyle(18, '500'),
  },
  email: {
    ...setFontStyle(15, '400', APP_COLORS.GRAY),
  },
  signOut: {
    marginVertical: 10,
  },
  menuRow: {
    height: 54,
    backgroundColor: 'white',
    justifyContent: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginVertical: 0.5,
  },
  menuText: {
    ...setFontStyle(),
  },
});

export default ProfileScreen;

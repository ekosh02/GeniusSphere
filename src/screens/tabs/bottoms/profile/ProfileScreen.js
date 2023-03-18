import React, {useEffect, useState} from 'react';
import Header from '../../../../components/bars/Header';
import Viewer from '../../../../components/views/Viewer';
import RowView from '../../../../components/views/RowView';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {WIDTH} from '../../../../constants/screenDimensions';
import {APP_COLORS} from '../../../../constants/colors';
import TextButton from '../../../../components/buttons/TextButton';
import {useAuthProvider} from '../../../../providers/AuthProvider';
import auth from '@react-native-firebase/auth';
import {APP_KEYS} from '../../../../constants/keys';
import {setStorage} from '../../../../utils/AsyncStorage';
import {APP_ROUTES} from '../../../../constants/routes';
import firestore from '@react-native-firebase/firestore';
import {setFontStyle} from '../../../../utils/setFontStyle';
import {FIRESTORE_COLLECTIONS} from '../../../../constants/firestore';
import {ArrowGoIcon} from '../../../../assets/icons';

const ProfileScreen = props => {
  const {isToken, setIsToken} = useAuthProvider();
  const [data, setData] = useState({
    collection: {},
    screenLoading: false,
    buttonLoading: false,
  });

  const menu = [
    {
      name: 'Заявки',
      router: APP_ROUTES.REQUEST_SCREEN,
      show:
        data.collection.role === 2 || data.collection.role === 3 ? true : false,
      params: data.collection.role,
    },
  ];

  useEffect(() => {
    getCollection();
  }, []);

  const getCollection = async () => {
    setData(prev => ({...prev, screenLoading: true}));
    await firestore()
      .collection(FIRESTORE_COLLECTIONS.USERS)
      .doc(isToken)
      .get()
      .then(response => {
        console.log('user', response);
        setData(prev => ({
          ...prev,
          screenLoading: false,
          collection: response?._data,
        }));
      })
      .catch(error => {
        console.log(error);
        setData(prev => ({...prev, screenLoading: false}));
        return;
      });
  };

  const onPressSignOut = () => {
    setData(prev => ({...prev, buttonLoading: true}));
    auth()
      .signOut()
      .then(async () => {
        await setStorage(APP_KEYS.TOKEN, '');
        setIsToken('');
        console.log('Signed out');
        setData(prev => ({...prev, buttonLoading: false}));
        props.navigation.reset({
          index: 0,
          routes: [{name: APP_ROUTES.SIGN_IN_SCREEN}],
        });
      })
      .catch(error => {
        console.log(error);
        if (error.code === 'auth/no-current-user') {
          Alert.alert('Ни один пользователь не вошел в систему');
          setData(prev => ({...prev, buttonLoading: false}));
          return;
        }
        Alert.alert('');
        setData(prev => ({...prev, buttonLoading: false}));
        return;
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
      <Header />
      <Viewer scroll bounces loader={data.screenLoading} style={styles.profile}>
        <RowView style={styles.avatarView}>
          <View style={styles.avator} />
          <View style={styles.avatorCol}>
            <Text style={styles.name} numberOfLines={1}>
              {data.collection.full_name}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {data.collection.email}
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
              onPress={() => onPressMenu(value.router, value.params)}>
              <Text style={styles.menuText}>{value.name}</Text>
              <ArrowGoIcon />
            </TouchableOpacity>
          ))}
        <TextButton
          style={styles.signOut}
          label={'Выйти'}
          size={22}
          loader={data.buttonLoading}
          onPress={onPressSignOut}
        />
      </Viewer>
    </Viewer>
  );
};

const styles = StyleSheet.create({
  profile: {
    backgroundColor: APP_COLORS.GRAY_BACKGROUND,
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

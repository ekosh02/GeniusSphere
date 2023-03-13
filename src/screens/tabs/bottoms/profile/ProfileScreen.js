import React, {useEffect, useState} from 'react';
import Header from '../../../../components/bars/Header';
import Viewer from '../../../../components/views/Viewer';
import RowView from '../../../../components/views/RowView';
import {Alert, StyleSheet, Text, View} from 'react-native';
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

const ProfileScreen = props => {
  const {isToken, setIsToken} = useAuthProvider();
  const [data, setData] = useState({
    collection: {},
    screenLoading: false,
    buttonLoading: false,
  });

  useEffect(() => {
    if (isToken) {
      getCollection();
    }
  }, [isToken]);

  const getCollection = async () => {
    setData(prev => ({
      ...prev,
      screenLoading: true,
    }));
    await firestore()
      .collection('users')
      .doc(isToken)
      .get()
      .then(response => {
        console.log('response', response?._data);
        setData(prev => ({
          ...prev,
          screenLoading: false,
          collection: response?._data,
        }));
      })
      .catch(error => {
        console.log(error);
        setData(prev => ({
          ...prev,
          screenLoading: false,
        }));
        return;
      });
  };
  const onPressSignOut = () => {
    setData(prev => ({
      ...prev,
      buttonLoading: true,
    }));
    auth()
      .signOut()
      .then(async () => {
        await setStorage(APP_KEYS.TOKEN, '');
        setIsToken('');
        console.log('Signed out');
        setData(prev => ({
          ...prev,
          buttonLoading: false,
        }));
        props.navigation.reset({
          index: 0,
          routes: [{name: APP_ROUTES.SIGN_IN_SCREEN}],
        });
      })
      .catch(error => {
        console.log(error);
        if (error.code === 'auth/no-current-user') {
          Alert.alert('Ни один пользователь не вошел в систему');
          setData(prev => ({
            ...prev,
            buttonLoading: false,
          }));
          return;
        }
        Alert.alert('');
        setData(prev => ({
          ...prev,
          buttonLoading: false,
        }));
        return;
      });
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
    backgroundColor: APP_COLORS.GRAY_BACKGROUND
  },
  avatarView: {
    height: 118,
    width: WIDTH,
  },
  avator: {
    width: 86,
    height: 86,
    backgroundColor: 'green',
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
});

export default ProfileScreen;

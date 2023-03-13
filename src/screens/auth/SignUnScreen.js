import React, {useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet, Text} from 'react-native';
import Header from '../../components/bars/Header';
import Viewer from '../../components/views/Viewer';
import {APP_ROUTES} from '../../constants/routes';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Input from '../../components/inputs/Input';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import {setStorage} from '../../utils/AsyncStorage';
import {APP_KEYS} from '../../constants/keys';
import {useAuthProvider} from '../../providers/AuthProvider';
import {FIRESTORE_COLLECTIONS, FIRESTORE_ID} from '../../constants/firestore';

const SignUnScreen = props => {
  const {setIsToken} = useAuthProvider();

  const [data, setData] = useState({
    collectionKey: {},
    keyLoading: false,
    inputKey: '',
    showMore: false,
    buttonLoading: false,
  });

  let dataSourse = useRef({
    full_name: '',
    email: '',
    password: '',
    repeat_password: '',
  });

  useEffect(() => {
    if (data.collectionKey === data.inputKey) {
      setData(prev => ({
        ...prev,
        showMore: true,
      }));
    } else {
      setData(prev => ({
        ...prev,
        showMore: false,
      }));
    }
  }, [data.inputKey]);

  useEffect(() => {
    getKey();
  }, []);

  const getKey = async () => {
    setData(prev => ({
      ...prev,
      keyLoading: true,
    }));
    await firestore()
      .collection(FIRESTORE_COLLECTIONS.STATUS)
      .doc(FIRESTORE_ID.STATUS)
      .get()
      .then(response => {
        setData(prev => ({
          ...prev,
          collectionKey: response?._data?.adminKey,
          keyLoading: false,
        }));
      })
      .catch(error => {
        console.log(error);
        setData(prev => ({
          ...prev,
          keyLoading: false,
        }));
      });
  };

  const onPressSignUp = () => {
    const full_name = dataSourse.current.full_name;
    const email = dataSourse.current.email;
    const password = dataSourse.current.password;
    const repeat_password = dataSourse.current.repeat_password;
    setData(prev => ({
      ...prev,
      buttonLoading: true,
    }));

    if (!full_name) {
      Alert.alert('Поле имени не должно содержать пустую строку');
      setData(prev => ({
        ...prev,
        buttonLoading: false,
      }));
      return;
    }
    if (email?.includes(' ') || email == undefined || email?.length < 6) {
      Alert.alert(
        'Поле электронной почты не может содержать менее 5 символов или содержать пустую строку',
      );
      setData(prev => ({
        ...prev,
        buttonLoading: false,
      }));
      return;
    }
    if (
      password?.includes(' ') ||
      password == undefined ||
      password?.length < 5
    ) {
      Alert.alert(
        'Поле пароль не может быть меньше 5 символов или содержать пустую строку',
      );
      setData(prev => ({
        ...prev,
        buttonLoading: false,
      }));
      return;
    }
    if (
      repeat_password?.includes(' ') ||
      repeat_password == undefined ||
      repeat_password?.length < 5
    ) {
      Alert.alert(
        'Поле повторите пароль не может быть меньше 5 символов или содержать пустую строку',
      );
      setData(prev => ({
        ...prev,
        buttonLoading: false,
      }));
      return;
    }
    if (password != repeat_password) {
      Alert.alert('Пароли не подходят');
      setData(prev => ({
        ...prev,
        buttonLoading: false,
      }));
      return;
    }
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        firestore()
          .collection(FIRESTORE_COLLECTIONS.USERS)
          .doc(response?.user?.uid)
          .set({
            id: response?.user?.uid,
            full_name: full_name,
            email: email,
            email: email,
            role: 1,
          })
          .then(async () => {
            console.log('Sign up', response);
            const token = response?.user?.uid;
            await setStorage(APP_KEYS.TOKEN, token);
            setIsToken(token);
            setData(prev => ({
              ...prev,
              buttonLoading: false,
            }));
            props.navigation.navigate(APP_ROUTES.BOTTOM_TAB);
          });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          Alert.alert(
            strings['Этот адрес электронной почты уже используется!'],
          );
          setLoading(false);
          return;
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          Alert.alert(strings['Этот адрес электронной почты недействителен!']);
          setLoading(false);
          return;
        }

        console.log(error);
        Alert.alert(strings['Произошла неизвестная ошибка']);
        setLoading(false);
        return;
      });
  };

  return (
    <Viewer>
      <Header routes={APP_ROUTES.SIGN_IN_SCREEN} />
      <Viewer loader={data.keyLoading} scroll bounces>
        <Input
          placeholder="Ключ"
          style={styles.marginTop}
          secureTextEntry
          getValue={value =>
            setData(prev => ({
              ...prev,
              inputKey: value,
            }))
          }
        />
        {data.showMore ? (
          <Viewer>
            <Input
              placeholder="Полное имя"
              getValue={value => (dataSourse.current.full_name = value)}
            />
            <Input
              placeholder="Электронная почта"
              getValue={value => (dataSourse.current.email = value)}
            />
            <Input
              placeholder="Пароль"
              getValue={value => (dataSourse.current.password = value)}
              secureTextEntry
            />
            <Input
              placeholder="Повторите пароль"
              getValue={value => (dataSourse.current.repeat_password = value)}
              secureTextEntry
            />
            <PrimaryButton
              label="Зарегистрироваться"
              onPress={onPressSignUp}
              style={styles.marginTop}
              loader={data.buttonLoading}
            />
          </Viewer>
        ) : null}
      </Viewer>
    </Viewer>
  );
};

const styles = StyleSheet.create({
  marginTop: {
    marginTop: 10,
  },
});

export default SignUnScreen;

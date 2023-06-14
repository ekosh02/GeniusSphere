import React, {useRef, useState} from 'react';
import {Alert, Platform, StyleSheet} from 'react-native';
import Viewer from '../../components/views/Viewer';
import Header from '../../components/bars/Header';
import Input from '../../components/inputs/Input';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import auth from '@react-native-firebase/auth';
import {setStorageObject} from '../../utils/AsyncStorage';
import {APP_KEYS} from '../../constants/keys';
import {APP_ROUTES} from '../../constants/routes';
import TextButton from '../../components/buttons/TextButton';
import {useUserProvider} from '../../providers/UserProvider';
import firestore from '@react-native-firebase/firestore';
import {FIRESTORE_COLLECTIONS} from '../../constants/firestore';
import { strings } from '../../languages/languages';

const SignInScreen = props => {
  const {setUserData} = useUserProvider();

  const [loading, setLoading] = useState(false);

  let data = useRef({
    email: '',
    password: '',
  });

  const OnPressSignIn = () => {
    setLoading(true);
    const email = data?.current?.email;
    const password = data?.current?.password;
    if (email?.includes(' ') || email == undefined || email?.length < 6) {
      Alert.alert(
        strings['Поле электронной почты не может содержать менее 5 символов или содержать пустую строку'],
      );
      setLoading(false);
      return;
    }
    if (
      password?.includes(' ') ||
      password == undefined ||
      password?.length < 5
    ) {
      Alert.alert(
        strings['Поле пароля не может быть меньше 5 символов или содержать пустую строку'],
      );
      setLoading(false);
      return;
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async response => {
        console.log('Sign in', response);
        const token = response?.user?.uid;
        console.log('token', token);
        await firestore()
          .collection(FIRESTORE_COLLECTIONS.USERS)
          .doc(token)
          .get()
          .then(response => {
            console.log('user', response);
            setUserData(response._data);
            setStorageObject(APP_KEYS.USER_DATA, response._data);
            setLoading(false);
          })
          .catch(error => {
            console.log(error);
            setLoading(false);
            return;
          });

        props.navigation.replace(APP_ROUTES.BOTTOM_TAB);
      })
      .catch(error => {
        if (error?.code === 'auth/wrong-password') {
          Alert.alert(strings['Пароль недействителен или у пользователя нет пароля!']);
          setLoading(false);
          return;
        }
        if (error?.code === 'auth/invalid-email') {
          Alert.alert(strings['Адрес электронной почты имеет неправильный формат!']);
          setLoading(false);
          return;
        }
        if (error?.code === 'auth/user-not-found') {
          Alert.alert(
            strings['Нет записи пользователя, соответствующей этому идентификатору. Возможно, пользователь был удален'],
          );
          setLoading(false);
          return;
        }
        console.log(error);
        Alert.alert(strings['Произошла неизвестная ошибка']);
        setLoading(false);
        return;
      });
  };

  const onPressSignUp = () => {
    props.navigation.replace(APP_ROUTES.SIGN_UP_SCREEN);
  };
  return (
    <Viewer>
      <Header label={strings["Авторизация"]} />
      <Viewer scroll bounces>
        <Input
          placeholder={strings["Электронная почта"]}
          style={styles.topInput}
          getValue={value => (data.current.email = value)}
        />
        <Input
          placeholder={strings["Пароль"]}
          style={styles.bottomInput}
          secureTextEntry
          getValue={value => (data.current.password = value)}
        />
        <PrimaryButton label={strings["Войти"]} onPress={OnPressSignIn} loader={loading} />
        <TextButton
          label={strings["У меня нет аккунта"]}
          size={16}
          style={styles.textButton}
          onPress={onPressSignUp}
        />
      </Viewer>
    </Viewer>
  );
};

const styles = StyleSheet.create({
  topInput: {
    marginTop: 16,
  },
  bottomInput: {
    marginBottom: 16,
  },
  textButton: {
    marginTop: 10,
  },
});

export default SignInScreen;

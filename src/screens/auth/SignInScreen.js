import React, {useRef, useState} from 'react';
import {Alert, Platform, StyleSheet} from 'react-native';
import Viewer from '../../components/views/Viewer';
import Header from '../../components/bars/Header';
import Input from '../../components/inputs/Input';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import auth from '@react-native-firebase/auth';
import {useAuthProvider} from '../../providers/AuthProvider';
import {setStorage} from '../../utils/AsyncStorage';
import {APP_KEYS} from '../../constants/keys';
import {APP_ROUTES} from '../../constants/routes';
import TextButton from '../../components/buttons/TextButton';

const SignInScreen = props => {
  const {setIsToken} = useAuthProvider();
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
        'Поле электронной почты не может содержать менее 5 символов или содержать пустую строку',
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
        'Поле пароля не может быть меньше 5 символов или содержать пустую строку',
      );
      setLoading(false);
      return;
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async response => {
        console.log('Sign in', response);
        const token = response?.user?.uid;
        setIsToken(token);
        setStorage(APP_KEYS.TOKEN, token);
        setLoading(false);
        props.navigation.replace(APP_ROUTES.BOTTOM_TAB);
      })
      .catch(error => {
        if (error?.code === 'auth/wrong-password') {
          console.log(
            'The password is invalid or the user does not have a password!',
          );
          Alert.alert('Пароль недействителен или у пользователя нет пароля!');
          setLoading(false);
          return;
        }
        if (error?.code === 'auth/invalid-email') {
          console.log('The email address is badly formatted!');
          Alert.alert('Адрес электронной почты имеет неправильный формат!');
          setLoading(false);
          return;
        }
        if (error?.code === 'auth/user-not-found') {
          console.log(
            'There is no user record corresponding to this identifier. The user may have been deleted.',
          );
          Alert.alert(
            'Нет записи пользователя, соответствующей этому идентификатору. Возможно, пользователь был удален',
          );
          setLoading(false);
          return;
        }
        console.log(error);
        Alert.alert('Произошла неизвестная ошибка');
        setLoading(false);
        return;
      });
  };

  const onPressSignUp = () => {
    props.navigation.replace(APP_ROUTES.SIGN_UP_SCREEN);
  };
  return (
    <Viewer>
      <Header label="Авторизация" />
      <Viewer scroll bounces>
        <Input
          placeholder="Электронная почта"
          style={styles.topInput}
          getValue={value => (data.current.email = value)}
        />
        <Input
          placeholder="Пароль"
          style={styles.bottomInput}
          secureTextEntry
          getValue={value => (data.current.password = value)}
        />
        <PrimaryButton label="Войти" onPress={OnPressSignIn} loader={loading} />
        <TextButton
          label="У меня нет аккунта"
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

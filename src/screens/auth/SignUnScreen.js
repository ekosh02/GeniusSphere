import React, {useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import Header from '../../components/bars/Header';
import Viewer from '../../components/views/Viewer';
import {APP_ROUTES} from '../../constants/routes';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Input from '../../components/inputs/Input';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import {setStorageObject} from '../../utils/AsyncStorage';
import {APP_KEYS} from '../../constants/keys';
import {useUserProvider} from '../../providers/UserProvider';
import {FIRESTORE_COLLECTIONS, FIRESTORE_ID} from '../../constants/firestore';

const SignUnScreen = props => {
  const {setUserData} = useUserProvider();

  const [data, setData] = useState({
    collection_key: {},
    keyLoading: false,
    inputKey: '',
    roleId: 0,
    buttonLoading: false,
  });

  let dataSourse = useRef({
    full_name: '',
    email: '',
    password: '',
    repeat_password: '',
  });

  useEffect(() => {
    if (data?.collection_key?.supervisor_key === data.inputKey) {
      setData(prev => ({
        ...prev,
        roleId: 3,
      }));
    } else if (data?.collection_key?.teacher_key === data.inputKey) {
      setData(prev => ({
        ...prev,
        roleId: 2,
      }));
    } else if (data?.collection_key?.student_key === data.inputKey) {
      setData(prev => ({
        ...prev,
        roleId: 1,
      }));
    } else {
      setData(prev => ({
        ...prev,
        roleId: 0,
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
          collection_key: response?._data,
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
    setData(prev => ({...prev, buttonLoading: true}));
    const {full_name, email, password, repeat_password} = dataSourse.current;

    if (!full_name) {
      Alert.alert('Поле имени не должно содержать пустую строку');
      setData(prev => ({...prev, buttonLoading: false}));
      return;
    }
    if (email?.includes(' ') || email == undefined || email?.length < 6) {
      Alert.alert(
        'Поле электронной почты не может содержать менее 5 символов или содержать пустую строку',
      );
      setData(prev => ({...prev, buttonLoading: false}));
      return;
    }
    if (data.roleId === 3) {
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
              role: data.roleId,
            })
            .then(async () => {
              console.log('Sign up', response);
              const token = response?.user?.uid;
              const data = {
                id: token,
                full_name: full_name,
                email: email,
                role: data.roleId,
              };
              await setStorageObject(APP_KEYS.USER_DATA, data);
              setUserData(data);
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
            setData(prev => ({
              ...prev,
              buttonLoading: false,
            }));
            return;
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
            Alert.alert(
              strings['Этот адрес электронной почты недействителен!'],
            );
            setData(prev => ({
              ...prev,
              buttonLoading: false,
            }));
            return;
          }
          console.log(error);
          Alert.alert(strings['Произошла неизвестная ошибка']);
          setData(prev => ({
            ...prev,
            buttonLoading: false,
          }));
          return;
        });
    } else if (data.roleId === 2 || data.roleId === 1) {
      sendRequest(data.roleId);
      return;
    } else {
      setData(prev => ({
        ...prev,
        buttonLoading: false,
      }));
      return;
    }
  };

  const sendRequest = roleId => {
    const api =
      roleId === 2
        ? FIRESTORE_COLLECTIONS.TEACHER_REQUEST
        : FIRESTORE_COLLECTIONS.STUDENT_REQUEST;

    const collection = firestore().collection(api);
    const id = collection.doc().id;
    const collectionWithId = collection.doc(id);

    const data = {
      id: id,
      full_name: dataSourse.current.full_name,
      email: dataSourse.current.email,
      role: roleId,
    };

    collectionWithId
      .set(data)
      .then(response => {
        console.log('response', response);
        Alert.alert(
          `Ваш запрос отправлен ${roleId === 2 ? `Руководителю` : `Учетелю`}`,
        );
        setData(prev => ({
          ...prev,
          buttonLoading: false,
        }));
      })
      .catch(error => {
        console.log(error);
        Alert.alert('Произошла неизвестная ошибка');
        setData(prev => ({
          ...prev,
          buttonLoading: false,
        }));
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
        {data.roleId !== 0 ? (
          <Viewer>
            <Input
              placeholder="Полное имя"
              getValue={value => (dataSourse.current.full_name = value)}
            />
            <Input
              placeholder="Электронная почта"
              getValue={value => (dataSourse.current.email = value)}
            />
            {data.roleId === 1 || data.roleId === 2 ? null : (
              <View>
                <Input
                  placeholder="Пароль"
                  getValue={value => (dataSourse.current.password = value)}
                  secureTextEntry
                />
                <Input
                  placeholder="Повторите пароль"
                  getValue={value =>
                    (dataSourse.current.repeat_password = value)
                  }
                  secureTextEntry
                />
              </View>
            )}
            <PrimaryButton
              label={
                data.roleId === 3
                  ? 'Зарегистрироваться'
                  : data.roleId === 2 || data.roleId === 1
                  ? 'Отправить запрос'
                  : 'Ошибка'
              }
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

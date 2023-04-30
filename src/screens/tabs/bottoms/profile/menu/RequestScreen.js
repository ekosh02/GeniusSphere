import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {navHeader} from '../../../../../components/bars/navHeader';
import Viewer from '../../../../../components/views/Viewer';
import {FIRESTORE_COLLECTIONS} from '../../../../../constants/firestore';
import firestore from '@react-native-firebase/firestore';
import {APP_COLORS} from '../../../../../constants/colors';
import {setFontStyle} from '../../../../../utils/setFontStyle';
import {WIDTH} from '../../../../../constants/screenDimensions';
import PrimaryButton from '../../../../../components/buttons/PrimaryButton';
import TextButton from '../../../../../components/buttons/TextButton';
import RowView from '../../../../../components/views/RowView';
import Input from '../../../../../components/inputs/Input';
import auth from '@react-native-firebase/auth';
import {useUserProvider} from '../../../../../providers/UserProvider';
import {strings} from '../../../../../languages/languages';

const RequestScreen = props => {
  const {userData} = useUserProvider();

  const [data, setData] = useState({
    collection: {},
    loading: false,
    modal: false,
    modalData: {},
    buttonLoading: false,
    password: '',
    removeId: '',
  });

  useLayoutEffect(() => {
    navHeader(props.navigation, 'Заявки');
  }, []);

  useEffect(() => {
    getCollection();
  }, []);

  const getCollection = async () => {
    setData(prev => ({
      ...prev,
      loading: true,
    }));
    await firestore()
      .collection(
        userData.role === 3
          ? FIRESTORE_COLLECTIONS.TEACHER_REQUEST
          : FIRESTORE_COLLECTIONS.STUDENT_REQUEST,
      )
      .get()
      .then(response => {
        console.log('response', response?._docs);
        setData(prev => ({
          ...prev,
          collection: response?._docs,
          loading: false,
        }));
      })
      .catch(error => {
        console.log(error);
        setData(prev => ({
          ...prev,
          loading: false,
        }));
      });
  };

  const onPressRequestItem = (id, full_name, email) => {
    setData(prev => ({
      ...prev,
      modal: true,
      modalData: {id: id, full_name: full_name, email: email},
    }));
  };

  const onPressCreateUser = () => {
    setData(prev => ({...prev, buttonLoading: true}));
    if (
      data.password?.includes(' ') ||
      data.password == undefined ||
      data.password?.length < 5
    ) {
      Alert.alert(
        strings[
          'Поле повторите пароль не может быть меньше 5 символов или содержать пустую строку'
        ],
      );
      setData(prev => ({...prev, buttonLoading: false}));
      return;
    }
    auth()
      .createUserWithEmailAndPassword(data.modalData.email, data.password)
      .then(response => {
        firestore()
          .collection(FIRESTORE_COLLECTIONS.USERS)
          .doc(response?.user?.uid)
          .set({
            id: response?.user?.uid,
            full_name: data.modalData.full_name,
            email: data.modalData.email,
            role: userData.role === 3 ? 2 : 1,
          })
          .then(() => {
            const docRef = firestore()
              .collection(
                userData.role === 3
                  ? FIRESTORE_COLLECTIONS.TEACHER_REQUEST
                  : FIRESTORE_COLLECTIONS.STUDENT_REQUEST,
              )
              .doc(data.modalData.id);
            docRef
              .delete()
              .then(() => {
                getCollection();
              })
              .catch(error => {
                console.error('Ошибка при удалении документа: ', error);
              });
            setData(prev => ({...prev, buttonLoading: false, modal: false}));
          });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          Alert.alert(
            strings['Этот адрес электронной почты уже используется!'],
          );
          setData(prev => ({...prev, buttonLoading: false}));
          return;
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          Alert.alert(strings['Этот адрес электронной почты недействителен!']);
          setData(prev => ({...prev, buttonLoading: false}));

          return;
        }
        console.log(error);
        Alert.alert(strings['Произошла неизвестная ошибка']);
        setData(prev => ({...prev, buttonLoading: false}));
        return;
      });
  };

  const renderRequest = useCallback(item => {
    const {id, full_name, email} = item?.item?._data;
    return (
      <RequestItem
        id={id}
        full_name={full_name}
        email={email}
        onPressRequestItem={onPressRequestItem}
      />
    );
  }, []);

  const keyExtractor = useCallback(item => item.id.toString(), []);

  return (
    <Viewer loader={data.loading} style={styles.view}>
      <FlatList
        data={data.collection}
        renderItem={renderRequest}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        onRefresh={getCollection}
        refreshing={data.loading}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={data.modal}
        onRequestClose={() => setData(prev => ({...prev, modal: false}))}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalTopView}>
              <Text>{strings['Создать пользователя']}</Text>
              <Text>{`${strings['Полное имя']} ${data.modalData.full_name}`}</Text>
              <Text>{`Электронная почта ${data.modalData.email}`}</Text>
              <Input
                secureTextEntry
                placeholder={strings['Создайте пользователю пароль']}
                style={styles.input}
                getValue={value =>
                  setData(prev => ({...prev, password: value}))
                }
              />
              <RowView style={styles.modalRow}>
                <PrimaryButton
                  onPress={() => onPressCreateUser()}
                  style={styles.modalButton}
                  loader={data.buttonLoading}
                  label={strings.Создать}
                />
                <TextButton
                  onPress={() => setData(prev => ({...prev, modal: false}))}
                  style={styles.modalButton}
                  label={strings.Отмена}
                  size={20}
                />
              </RowView>
            </View>
          </View>
        </View>
      </Modal>
    </Viewer>
  );
};

const RequestItem = ({
  id,
  full_name,
  email,
  onPressRequestItem = () => undefined,
}) => {
  return (
    <TouchableOpacity
      style={styles.itemView}
      activeOpacity={0.8}
      onPress={() => onPressRequestItem(id, full_name, email)}>
      <Text style={styles.title} numberOfLines={1}>
        {full_name}
      </Text>
      <Text style={styles.description} numberOfLines={1}>
        {email}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: APP_COLORS.GRAY_BACKGROUND,
  },
  itemView: {
    height: 62,
    marginHorizontal: 8,
    marginTop: 15,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  title: {
    ...setFontStyle(18, '500'),
  },
  description: {
    ...setFontStyle(16, '400', APP_COLORS.GRAY),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_COLORS.PLACEHOLDER,
  },
  modalView: {
    justifyContent: 'space-evenly',
    width: WIDTH - 32,
    height: WIDTH / 1.9,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    width: WIDTH / 2.8,
    height: 38,
  },
  modalRow: {
    width: WIDTH / 1.4,
    justifyContent: 'space-evenly',
  },
  input: {
    width: WIDTH - 64,
    paddingHorizontal: 0,
  },
  modalTopView: {
    width: WIDTH - 32,
    paddingHorizontal: 16,
    height: WIDTH / 2,
    justifyContent: 'space-evenly',
  },
});

export default RequestScreen;

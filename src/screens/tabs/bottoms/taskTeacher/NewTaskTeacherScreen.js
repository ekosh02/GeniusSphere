import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import Viewer from '../../../../components/views/Viewer';
import {navHeader} from '../../../../components/bars/navHeader';
import Input from '../../../../components/inputs/Input';
import {FIRESTORE_COLLECTIONS} from '../../../../constants/firestore';
import firestore from '@react-native-firebase/firestore';
import {ArrowDownIcon, ArrowUpIcon, Xicon} from '../../../../assets/icons';
import {setFontStyle} from '../../../../utils/setFontStyle';
import {APP_COLORS} from '../../../../constants/colors';
import {WIDTH} from '../../../../constants/screenDimensions';
import PrimaryButton from '../../../../components/buttons/PrimaryButton';
import {useUserProvider} from '../../../../providers/UserProvider';
import { strings } from '../../../../languages/languages';

const NewTaskTeacherScreen = props => {
  const {getCollection} = props?.route?.params;

  const {userData} = useUserProvider();

  const [dataSource, setDataSource] = useState({
    collections: [],
    loading: false,
    buttonLoading: false,
    modal: false,
    id: '',
    full_name: '',
    title: '',
    description: '',
  });

  useLayoutEffect(() => {
    navHeader(props.navigation, strings['Новое задание']);
  }, []);

  console.log();
  useEffect(() => {
    getCollections();
  }, []);

  const getCollections = async () => {
    setDataSource(prev => ({...prev, loading: true}));
    await firestore()
      .collection(FIRESTORE_COLLECTIONS.USERS)
      .get()
      .then(async response => {
        const collection = response._docs
          .map((item, index) => ({...item, index}))
          .filter(item => item._data.role === 1);
        console.log(FIRESTORE_COLLECTIONS.USERS, collection);
        setDataSource(prev => ({
          ...prev,
          loading: false,
          collections: collection,
        }));
      })
      .catch(error => {
        console.log(error);
        setDataSource(prev => ({...prev, loading: false}));
      });
  };

  const onPressModalFalse = () => {
    setDataSource(prev => ({...prev, modal: !prev.modal}));
  };

  const onPressChooseUser = (id, full_name) => {
    setDataSource(prev => ({
      ...prev,
      modal: !prev.modal,
      id: id,
      full_name: full_name,
    }));
  };

  const onPressAddTask = () => {
    setDataSource(prev => ({...prev, buttonLoading: true}));
    if (dataSource.title === '') {
      Alert.alert(strings['Поле Тема не должно быть пустым']);
      setDataSource(prev => ({...prev, buttonLoading: false}));
      return;
    } else if (dataSource.description === '') {
      Alert.alert(strings['Поле Описание не должно быть пустым']);
      setDataSource(prev => ({...prev, buttonLoading: false}));
      return;
    } else if (dataSource.id === '') {
      Alert.alert(strings['Выбирите кому хотите отправит задачу']);
      setDataSource(prev => ({...prev, buttonLoading: false}));
      return;
    }

    const collectionRef = firestore().collection(
      FIRESTORE_COLLECTIONS.TEACHER_TASKS,
    );
    const data = {
      title: dataSource?.title,
      description: dataSource?.description,
      to: dataSource?.id,
      name: dataSource?.full_name,
      status: 0,
      from: userData.id,
      fromRole: userData.role,
    };
    const docRef = collectionRef.doc(); // create a new document reference
    data.id = docRef.id; // add the ID to the data object
    docRef
      .set(data)
      .then(() => {
        setDataSource(prev => ({...prev, buttonLoading: false}));
        Alert.alert(strings['Задача успешно отправлено!']);
        getCollection();
        props.navigation.goBack();
      })
      .catch(error => {
        console.log(error);
        setDataSource(prev => ({...prev, buttonLoading: false}));
      });
  };

  return (
    <Viewer style={styles.paddingVertical} loader={dataSource.loading}>
      <Input
        placeholder={strings.Тема}
        getValue={value => setDataSource(prev => ({...prev, title: value}))}
      />
      <Input
        placeholder={strings.Описание}
        multiline
        getValue={value =>
          setDataSource(prev => ({...prev, description: value}))
        }
      />
      <TouchableOpacity style={styles.button} onPress={onPressModalFalse}>
        <Text style={styles.buttonText}>{strings['Кому: ']} {dataSource?.full_name}</Text>
        {dataSource.modal ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </TouchableOpacity>
      <PrimaryButton
        onPress={onPressAddTask}
        loader={dataSource.buttonLoading}
      />
      <Modal animationType="fade" transparent={true} visible={dataSource.modal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.xicon} onPress={onPressModalFalse}>
              <Xicon />
            </TouchableOpacity>
            <Viewer style={styles.modalTopView} scroll bounces>
              {dataSource.collections.map(collection => {
                const {full_name, email, id} = collection?._data;
                return (
                  <TouchableOpacity
                    key={id}
                    style={[
                      styles.chooseList,
                      {
                        borderColor:
                          dataSource.id === id
                            ? APP_COLORS.PRIMARY
                            : APP_COLORS.BORDER,
                      },
                    ]}
                    onPress={() => onPressChooseUser(id, full_name)}>
                    <Text>{full_name}</Text>
                    <Text>{email}</Text>
                  </TouchableOpacity>
                );
              })}
            </Viewer>
          </View>
        </View>
      </Modal>
    </Viewer>
  );
};

const styles = StyleSheet.create({
  paddingVertical: {
    paddingVertical: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 16,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    ...setFontStyle(),
  },
  chooseList: {
    height: 48,
    borderWidth: 0.7,
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_COLORS.PLACEHOLDER,
  },
  modalView: {
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
  modalTopView: {
    flex: null,
    borderRadius: 10,
    paddingVertical: 16,
    width: WIDTH - 32,
    paddingLeft: 16,
    paddingRight: 38,
  },
  xicon: {
    width: 24,
    height: 24,
    right: 10,
    top: 10,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default NewTaskTeacherScreen;

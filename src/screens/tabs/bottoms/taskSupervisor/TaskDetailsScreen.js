import Viewer from '../../../../components/views/Viewer';
import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {navHeader} from '../../../../components/bars/navHeader';
import firestore from '@react-native-firebase/firestore';
import {FIRESTORE_COLLECTIONS} from '../../../../constants/firestore';
import {checkTaskStatus} from '../../../../utils/checkTaskStatus';
import {APP_COLORS} from '../../../../constants/colors';
import {WIDTH} from '../../../../constants/screenDimensions';
import {Xicon} from '../../../../assets/icons';
import {setFontStyle} from '../../../../utils/setFontStyle';
import {checkTaskColor} from '../../../../utils/checkTaskColor';
import {useUserProvider} from '../../../../providers/UserProvider';
import RowView from '../../../../components/views/RowView';
import {strings} from '../../../../languages/languages';
import PrimaryButton from '../../../../components/buttons/PrimaryButton';
import {wordLocalization} from '../../../../utils/wordLocalization';

const TaskDetailsScreen = props => {
  const {id, updateGetCollection} = props?.route?.params;
  const {userData} = useUserProvider();

  const [dataSource, setDataSource] = useState({
    collection: {},
    laoding: false,
    modal: false,
  });

  useEffect(() => {
    getCollection();
    if (userData.role === 2) {
      onVisibleTask();
    }
  }, []);

  useLayoutEffect(() => {
    navHeader(props.navigation, strings.Задания);
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [numberValue, setNumberValue] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const getCollection = async () => {
    setDataSource(prev => ({...prev, loading: true}));
    await firestore()
      .collection(FIRESTORE_COLLECTIONS.SUPERVISOR_TASKS)
      .doc(id)
      .get()
      .then(response => {
        console.log(FIRESTORE_COLLECTIONS.SUPERVISOR_TASKS, response._data);
        setDataSource(prev => ({
          ...prev,
          loading: false,
          collection: response._data,
        }));
      })
      .catch(error => {
        console.log(error);
        setDataSource(prev => ({...prev, loading: false}));
      });
  };

  const getCollection2 = async () => {
    setModalLoading(true);
    await firestore()
      .collection(FIRESTORE_COLLECTIONS.SUPERVISOR_TASKS)
      .doc(id)
      .get()
      .then(response => {
        console.log(FIRESTORE_COLLECTIONS.SUPERVISOR_TASKS, response._data);
        setModalLoading(false);
        setDataSource(prev => ({
          ...prev,
          collection: response._data,
        }));
      })
      .catch(error => {
        console.log(error);
        setModalLoading(false);
      });
  };

  const onVisibleTask = () => {
    const postRef = firestore()
      .collection(FIRESTORE_COLLECTIONS.SUPERVISOR_TASKS)
      .doc(id);

    postRef
      .update({
        isVisible: true,
      })
      .then(response => {
        console.log('visible', response);
        updateGetCollection();
      })
      .catch(e => {
        Alert.alert(strings['Произошла неизвестная ошибка']);
        console.log(e);
        return;
      });
  };

  const lists =
    userData.role === 3
      ? [{status: 0}, {status: 1}, {status: 2}]
      : [{status: 0}, {status: 1}];

  const onPressModalVisible = () => {
    setDataSource(prev => ({...prev, modal: !prev.modal}));
  };

  const onPressPressSubTask = (index, subtask) => {
    const docRef = firestore()
      .collection(FIRESTORE_COLLECTIONS.SUPERVISOR_TASKS)
      .doc(id);

    docRef.get().then(doc => {
      if (doc.exists) {
        const subtasks = doc.data().subtasks;
        subtasks[index].status = !subtasks[index].status;
        docRef
          .update({subtasks: subtasks})
          .then(() => {
            getCollection();
          })
          .catch(error => {
            console.log('error', error);
            getCollection();
          });
      }
    });
  };

  const OnPressDeleteTask = () => {
    const docRef = firestore()
      .collection(FIRESTORE_COLLECTIONS.SUPERVISOR_TASKS)
      .doc(id);

    docRef
      .delete()
      .then(() => {
        updateGetCollection();
        Alert.alert('Документ успешно удален');
        props.navigation.goBack();
      })
      .catch(error => {
        Alert.alert('Ошибка удаления документа');
        console.error('Ошибка удаления документа: ', error);
      });
  };

  const onPressModalStatus = status => {
    const docRef = firestore()
      .collection(FIRESTORE_COLLECTIONS.SUPERVISOR_TASKS)
      .doc(id);

    docRef
      .update({
        status: status,
      })
      .then(() => {
        console.log('Поле status успешно обновлено');
        onPressModalVisible();
        getCollection();
        updateGetCollection();
      })
      .catch(error => {
        console.error(error);
        getCollection();
      });
  };

  const onPressGrade = () => {
    if (parseInt(numberValue) < 0 || parseInt(numberValue) > 100) {
      Alert.alert('Оценка не можеть быть выше 100 или ниже 0');
      setModalVisible(false);
      return;
    }
    setModalLoading(true);
    const docRef = firestore()
      .collection(FIRESTORE_COLLECTIONS.SUPERVISOR_TASKS)
      .doc(id);

    docRef
      .update({
        grade: parseInt(numberValue),
      })
      .then(() => {
        console.log('Поле status успешно обновлено');
        setModalVisible(false);
        getCollection2();
      })
      .catch(error => {
        console.error(error);
        setModalVisible(false);
        setModalLoading(false);
      });
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSaveNumber = () => {
    if (!isNaN(numberValue)) {
      onPressGrade();
    }
  };

  const gradeColor = () => {
    const num = dataSource?.collection?.grade;
    if (num >= 0 && num <= 49) {
      return '#e01409';
    }
    if (num >= 50 && num <= 74) {
      return '#e68619';
    }
    if (num >= 75 && num <= 100) {
      return '#01941f';
    }

    return APP_COLORS.FONT;
  };

  const {title, description, status} = dataSource.collection;

  const currentDate = new Date();

  const deadlineDate = new Date(Date.parse(dataSource?.collection?.deadline));
  const timeDiff = deadlineDate.getTime() - currentDate.getTime();
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <Viewer loader={dataSource.loading} scroll bounces>
      <View style={styles.view}>
        <Text style={styles.text}>
          {strings['Тема: ']}
          {title}
        </Text>
        <Text style={styles.text}>
          {strings['Описание: ']}
          {description}
        </Text>
        <RowView>
          <Text style={styles.text}>{strings['Статус:   ']}</Text>
          <TouchableOpacity
            onPress={onPressModalVisible}
            style={[
              styles.statusView,
              {backgroundColor: checkTaskColor(status)},
            ]}>
            <Text style={styles.title}>{checkTaskStatus(status)}</Text>
          </TouchableOpacity>
        </RowView>
        <Text style={styles.text}>
          {strings['От: ']}
          {dataSource?.collection?.from}
        </Text>
        {dataSource?.collection?.grade && (
          <RowView>
            <Text style={{...setFontStyle()}}>{strings.Оценка} </Text>
            <Text style={{...setFontStyle(16, '400', gradeColor())}}>
              {modalLoading ? '...' : dataSource?.collection?.grade}{' '}
            </Text>
          </RowView>
        )}
      </View>
      <Modal animationType="fade" transparent={true} visible={dataSource.modal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.xicon}
              onPress={onPressModalVisible}>
              <Xicon />
            </TouchableOpacity>
            <Viewer style={styles.modalTopView} scroll bounces>
              {lists.map(list => (
                <TouchableOpacity
                  key={list.status}
                  onPress={() => onPressModalStatus(list.status)}
                  style={[
                    styles.statusView,
                    {
                      backgroundColor: checkTaskColor(list.status),
                      width: WIDTH - 102,
                    },
                  ]}>
                  <Text style={styles.title}>
                    {checkTaskStatus(list.status)}
                  </Text>
                </TouchableOpacity>
              ))}
            </Viewer>
          </View>
        </View>
      </Modal>
      <View style={{marginHorizontal: 16, marginBottom: 10}}>
        <Text
          style={{
            ...setFontStyle(16, '400', minutes > 0 ? APP_COLORS.FONT : 'red'),
          }}>
          {strings['Дедлайн до:']} {dataSource.collection.deadline}
        </Text>
      </View>
      <View style={{marginHorizontal: 16, marginBottom: 10}}>
        <Text
          style={{
            ...setFontStyle(16, '400', minutes > 0 ? APP_COLORS.FONT : 'red'),
          }}>
          {minutes > 0
            ? wordLocalization(
                strings['Осталось :days дней, :hours часов, :minutes минут'],
                {days: days, hours: hours, minutes: minutes},
              )
            : wordLocalization(
                strings[
                  'Задача просрочена уже как :days дней, :hours часов, :minutes минут назад'
                ],
                {days: -days, hours: -hours, minutes: -minutes},
              )}
        </Text>
      </View>
      {dataSource.collection?.subtasks ? (
        dataSource.collection?.subtasks.length !== 0 ? (
          <View style={{marginHorizontal: 16, marginBottom: 10}}>
            <Text style={{...setFontStyle}}>
              {strings['Задания выполнено на ']}
              {Math.round(
                (dataSource.collection?.subtasks.filter(
                  subtask => subtask.status === true,
                ).length *
                  100) /
                  dataSource.collection?.subtasks.length,
              )}
              {'%'}
            </Text>
          </View>
        ) : null
      ) : null}
      {dataSource.collection?.subtasks ? (
        dataSource.collection?.subtasks.length !== 0 ? (
          dataSource.collection?.subtasks.map((subtask, index) => {
            return (
              <TouchableOpacity
                style={[
                  styles.subtaskview,
                  {
                    borderColor: subtask.status
                      ? APP_COLORS.PRIMARY
                      : APP_COLORS.BORDER,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => onPressPressSubTask(index, subtask)}>
                <Text>{subtask.title}</Text>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={{...setFontStyle(), marginHorizontal: 16}}>
            {strings['Чеклистов нету']}
          </Text>
        )
      ) : null}

      {userData.role === 3 || userData.role === 4 ? (
        <PrimaryButton
          label={strings['Поставить оценку']}
          style={{height: 42, marginTop: 8}}
          onPress={handleOpenModal}
        />
      ) : null}
      {console.log('userData.role', userData.role)}
      {userData.role === 3 || userData.role === 4 ? (
        <PrimaryButton
          label={strings['Удалить задачу']}
          style={{height: 42, marginTop: 16}}
          onPress={OnPressDeleteTask}
        />
      ) : null}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={text => setNumberValue(text)}
            value={numberValue}
          />
          <View style={styles.buttonContainer}>
            <PrimaryButton
              label={strings.Сохранить}
              onPress={handleSaveNumber}
              style={{paddingHorizontal: 10}}
            />
            <PrimaryButton
              label={strings.Закрыть}
              onPress={handleCloseModal}
              style={{paddingHorizontal: 10}}
            />
          </View>
        </View>
      </Modal>
    </Viewer>
  );
};

const styles = StyleSheet.create({
  view: {
    padding: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_COLORS.PLACEHOLDER,
  },
  modalView: {
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'flex-end',
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
    borderRadius: 10,
    flex: null,
    paddingBottom: 8,
    width: WIDTH - 86,
    paddingLeft: 8,
    paddingRight: 8,
  },
  statusView: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'red',
    marginVertical: 4,
  },
  title: {
    ...setFontStyle(16, '500', 'white'),
  },
  text: {
    marginBottom: 5,
    ...setFontStyle(),
  },
  subtaskview: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
});

export default TaskDetailsScreen;

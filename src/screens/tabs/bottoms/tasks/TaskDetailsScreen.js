import Viewer from '../../../../components/views/Viewer';
import React, {useLayoutEffect, useEffect, useState} from 'react';
import {Text, StyleSheet, View, Modal, TouchableOpacity} from 'react-native';
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

const TaskDetailsScreen = props => {
  const {id} = props?.route?.params;
  const {userData} = useUserProvider();

  const [dataSource, setDataSource] = useState({
    collection: {},
    laoding: false,
    modal: false,
  });

  useEffect(() => {
    getCollection();
  }, []);

  useLayoutEffect(() => {
    navHeader(props.navigation, 'Задания');
  }, []);

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

  const lists =
    userData.role === 3
      ? [{status: 0}, {status: 1}, {status: 2}]
      : [{status: 0}, {status: 1}];

  const onPressModalVisible = () => {
    setDataSource(prev => ({...prev, modal: !prev.modal}));
  };

  const onPressModalStatus = status => {
    console.log('status', status);
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
      })
      .catch(error => {
        console.error(error);
        getCollection();
      });
  };

  const {title, description, status} = dataSource.collection;

  return (
    <Viewer loader={dataSource.loading} scroll bounces>
      <View style={styles.view}>
        <Text style={styles.text}>
          {'Тема: '}
          {title}
        </Text>
        <Text style={styles.text}>
          {'Описание: '}
          {description}
        </Text>
        <RowView>
          <Text style={styles.text}>{'Статус:   '}</Text>
          <TouchableOpacity
            onPress={onPressModalVisible}
            style={[
              styles.statusView,
              {backgroundColor: checkTaskColor(status)},
            ]}>
            <Text style={styles.title}>{checkTaskStatus(status)}</Text>
          </TouchableOpacity>
        </RowView>
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
});

export default TaskDetailsScreen;

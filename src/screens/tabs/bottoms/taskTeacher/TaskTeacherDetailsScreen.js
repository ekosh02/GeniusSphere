import Viewer from '../../../../components/views/Viewer';
import React, {useLayoutEffect, useEffect, useState, useCallback} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
  Keyboard,
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
import Input from '../../../../components/inputs/Input';
import {strings} from '../../../../languages/languages';

const TaskTeacherDetailsScreen = props => {
  const {id, updateGetCollection} = props?.route?.params;
  const {userData} = useUserProvider();

  const [dataSource, setDataSource] = useState({
    collection: {},
    laoding: false,
    modal: false,
    comment: '',
  });

  console.log('dataSource', dataSource);

  useEffect(() => {
    getCollection();
  }, []);

  useLayoutEffect(() => {
    navHeader(props.navigation, 'Задания');
  }, []);

  const getCollection = async () => {
    setDataSource(prev => ({...prev, loading: true}));
    await firestore()
      .collection(FIRESTORE_COLLECTIONS.TEACHER_TASKS)
      .doc(id)
      .get()
      .then(response => {
        console.log(FIRESTORE_COLLECTIONS.TEACHER_TASKS, response._data);
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
    userData.role === 3 || userData.role === 2
      ? [
          {status: 0, id: 'smdcklsdcmsmlh'},
          {status: 2, id: 'slnvnma;sdck'},
        ]
      : [];

  const onPressModalVisible = () => {
    if (userData.role === 1) {
      return;
    }
    setDataSource(prev => ({...prev, modal: !prev.modal}));
  };

  const onPressModalStatus = status => {
    console.log('status', status);
    const docRef = firestore()
      .collection(FIRESTORE_COLLECTIONS.TEACHER_TASKS)
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

  const onPressSend = () => {
    if (dataSource.comment === '') {
      Alert.alert(strings['Введите поле']);
      return;
    }

    const postRef = firestore()
      .collection(FIRESTORE_COLLECTIONS.TEACHER_TASKS)
      .doc(id);

    const newComment = {
      comment: dataSource.comment,
      id: userData.id,
      timestamp: Date.now(),
      name: userData.full_name,
      email: userData.email,
      role: userData.role,
    };

    console.log('newComment', newComment);

    postRef
      .update({
        comments: firestore.FieldValue.arrayUnion(newComment),
      })
      .then(response => {
        console.log('added comments', response);
        Keyboard.dismiss();
        getCollection();
      })
      .catch(e => {
        Alert.alert(strings['Произошла неизвестная ошибка']);
        console.log(e);
        return;
      });
  };

  const keyExtractor = useCallback(item => {
    return item.index;
  }, []);

  const renderItem = useCallback(item => {
    const {comment, id, name} = item.item;
    console.log('item.item', item.item);
    return (
      <RenderCommentItem
        comment={comment}
        idUser={id}
        name={name}
        currentId={userData.id}
      />
    );
  }, []);

  const {title, description, status, name} = dataSource.collection;

  return (
    <Viewer loader={dataSource.laoding}>
      <Viewer bounces>
        <View style={styles.view}>
          <Text style={styles.text}>
            {strings['Тема: ']}
            {title}
          </Text>
          <Text style={styles.text}>
            {strings['Описание: ']}
            {description}
          </Text>
          {userData.role === 1 ? null : (
            <Text style={styles.text}>
               {strings['Кому: ']}
              {name}
            </Text>
          )}
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
        <Text style={styles.commentTitle}>{strings.Комментарий}</Text>
        <FlatList
          data={dataSource?.collection?.comments}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </Viewer>
      <Input
        style={styles.bottom}
        getValue={value => setDataSource(prev => ({...prev, comment: value}))}
      />
      <TouchableOpacity onPress={onPressSend}>
        <Text style={styles.sendPosition}>{strings.отправить}</Text>
      </TouchableOpacity>
      <Modal animationType="fade" transparent={true} visible={dataSource.modal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.xicon}
              onPress={onPressModalVisible}>
              <Xicon />
            </TouchableOpacity>
            <Viewer style={styles.modalTopView} scroll bounces>
              {lists.map((list, index) => (
                <TouchableOpacity
                  key={list.id}
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

const RenderCommentItem = ({name, idUser, comment, currentId}) => {
  console.log('currentId', currentId, idUser);
  return (
    <View style={[styles.commentView]}>
      <Text
        style={[
          styles.commentText,
          {textAlign: idUser === currentId ? 'right' : 'left'},
        ]}>
        {name}
        {': '}
        {comment}
      </Text>
      <View style={styles.line} />
    </View>
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
  bottom: {
    bottom: Platform.OS === 'ios' ? 42 : 16,
  },
  commentView: {
    marginHorizontal: 16,
    marginVertical: 4,
    // backgroundColor: 'red'
  },
  commentText: {
    ...setFontStyle(14),
  },
  line: {
    marginVertical: 8,
    height: 1,
    backgroundColor: APP_COLORS.BORDER,
  },
  commentTitle: {
    margin: 16,
    ...setFontStyle(20, '600'),
  },
  sendPosition: {
    bottom: Platform.OS === 'ios' ? 60 : 32,
    position: 'absolute',
    right: 32,
  },
});

export default TaskTeacherDetailsScreen;

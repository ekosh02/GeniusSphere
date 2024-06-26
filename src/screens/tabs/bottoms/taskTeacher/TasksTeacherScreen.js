import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Viewer from '../../../../components/views/Viewer';
import Header from '../../../../components/bars/Header';
import {PlusIcon} from '../../../../assets/icons';
import {APP_COLORS} from '../../../../constants/colors';
import {FIRESTORE_COLLECTIONS} from '../../../../constants/firestore';
import firestore from '@react-native-firebase/firestore';
import {APP_ROUTES} from '../../../../constants/routes';
import {useUserProvider} from '../../../../providers/UserProvider';
import TasksTeacherItem from './TasksTeacherItem';
import {strings} from '../../../../languages/languages';
import Empty from '../../../../components/empty/Empty';
import {wordLocalization} from '../../../../utils/wordLocalization';

const TasksTeacherScreen = props => {
  const {userData} = useUserProvider();

  const [data, setData] = useState({
    collection: {},
    loading: false,
  });

  useEffect(() => {
    getCollection();
  }, []);

  const getCollection = async () => {
    setData(prev => ({...prev, loading: true}));
    await firestore()
      .collection(FIRESTORE_COLLECTIONS.TEACHER_TASKS)
      .get()
      .then(response => {
        const data =
          userData.role === 1
            ? response._docs.filter(item => item._data.to === userData.id)
            : userData.role === 3 || userData.role === 2 || userData.role === 4
            ? response._docs
            : [];
        console.log(FIRESTORE_COLLECTIONS.TEACHER_TASKS, data);
        setData(prev => ({...prev, collection: data, loading: false}));
      })
      .catch(error => {
        console.log(error);
        setData(prev => ({...prev, loading: false}));
      });
  };

  const onPressSupervisorTasksItem = id => {
    props.navigation.navigate(APP_ROUTES.TASK_TASK_DETAILS_SCREEN, {
      id: id,
      updateGetCollection: getCollection,
    });
  };

  const onPressSupervisorNewTask = id => {
    props.navigation.navigate(APP_ROUTES.NEW_TASK_TEACHER_SCREEN, {
      getCollection: getCollection,
    });
  };

  const ListHeaderComponent = () => {
    if (userData.role !== 1) {
      return <View></View>;
    }
    var count = 0;
    if (Array.isArray(data?.collection)) {
      count = data.collection.reduce(function (count, element) {
        const isTrue = element?._data?.isVisible;
        if (isTrue === false) {
          return count + 1;
        }
        return count;
      }, 0);
    }

    return (
      <Viewer style={{marginHorizontal: 16, marginVertical: 5}}>
        <Text>
          {wordLocalization(strings['У вас :count новых заданий'], {
            count: count,
          })}
        </Text>
      </Viewer>
    );
  };

  const renderReqest = useCallback(item => {
    const {id, title, description, from, to, date, status, name} =
      item?.item?._data;
    return (
      <TasksTeacherItem
        id={id}
        title={title}
        description={description}
        name={name}
        from={from}
        to={to}
        date={date}
        status={status}
        onPress={onPressSupervisorTasksItem}
      />
    );
  }, []);

  const keyExtractor = useCallback(item => item.id.toString(), []);

  return (
    <Viewer>
      <Header
        label={
          userData.role === 3 || userData.role === 2 || userData.role === 4
            ? strings['Заданий для студентов']
            : strings['Заданий от педагога']
        }
      />
      <Viewer loader={data.loading}>
        <FlatList
          data={data.collection}
          ListHeaderComponent={ListHeaderComponent}
          renderItem={renderReqest}
          contentContainerStyle={styles.flatListView}
          keyExtractor={keyExtractor}
          ListEmptyComponent={<Empty />}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          onRefresh={getCollection}
          refreshing={data.loading}
        />
        {userData.role === 1 ? null : (
          <TouchableOpacity
            style={styles.plusIcon}
            onPress={onPressSupervisorNewTask}
            activeOpacity={0.8}>
            <PlusIcon />
          </TouchableOpacity>
        )}
      </Viewer>
    </Viewer>
  );
};

const styles = StyleSheet.create({
  flatListView: {
    marginVertical: 10,
  },
  plusIcon: {
    backgroundColor: APP_COLORS.PRIMARY,
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 26,
  },
});

export default TasksTeacherScreen;

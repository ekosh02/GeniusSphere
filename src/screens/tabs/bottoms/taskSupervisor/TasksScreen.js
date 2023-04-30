import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import Viewer from '../../../../components/views/Viewer';
import Header from '../../../../components/bars/Header';
import {PlusIcon} from '../../../../assets/icons';
import {APP_COLORS} from '../../../../constants/colors';
import {FIRESTORE_COLLECTIONS} from '../../../../constants/firestore';
import firestore from '@react-native-firebase/firestore';
import TasksItem from './TasksItem';
import {APP_ROUTES} from '../../../../constants/routes';
import {useUserProvider} from '../../../../providers/UserProvider';
import { strings } from '../../../../languages/languages';

const TasksScreen = props => {
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
      .collection(FIRESTORE_COLLECTIONS.SUPERVISOR_TASKS)
      .get()
      .then(response => {
        console.log(FIRESTORE_COLLECTIONS.SUPERVISOR_TASKS, response.docs);
        const data =
          userData.role === 2
            ? response._docs.filter(item => item._data.to === userData.id)
            : userData.role === 3
            ? response._docs
            : [];
        setData(prev => ({...prev, collection: data, loading: false}));
      })
      .catch(error => {
        console.log(error);
        setData(prev => ({...prev, loading: false}));
      });
  };

  const onPressSupervisorTasksItem = id => {
    props.navigation.navigate(APP_ROUTES.TASK_DETAILS_SCREEN, {
      id: id,
      updateGetCollection: getCollection,
    });
  };

  const onPressSupervisorNewTask = id => {
    props.navigation.navigate(APP_ROUTES.NEW_TASK_SCREEN, {
      getCollection: getCollection,
    });
  };

  const renderReqest = useCallback(item => {
    const {id, title, description, from, to, date, status} = item?.item?._data;
    return (
      <TasksItem
        id={id}
        title={title}
        description={description}
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
          userData.role === 3 ? strings['Заданий для учетелей'] : strings['Заданий от админа']
        }
      />
      <Viewer loader={data.loading}>
        <FlatList
          data={data.collection}
          renderItem={renderReqest}
          contentContainerStyle={styles.flatListView}
          keyExtractor={keyExtractor}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          onRefresh={getCollection}
          refreshing={data.loading}
        />
        {userData.role === 3 ? (
          <TouchableOpacity
            style={styles.plusIcon}
            onPress={onPressSupervisorNewTask}
            activeOpacity={0.8}>
            <PlusIcon />
          </TouchableOpacity>
        ) : null}
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

export default TasksScreen;

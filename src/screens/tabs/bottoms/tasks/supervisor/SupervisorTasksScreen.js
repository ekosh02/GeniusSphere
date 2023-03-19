import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Viewer from '../../../../../components/views/Viewer';
import Header from '../../../../../components/bars/Header';
import {PlusIcon} from '../../../../../assets/icons';
import {APP_COLORS} from '../../../../../constants/colors';
import {FIRESTORE_COLLECTIONS} from '../../../../../constants/firestore';
import firestore from '@react-native-firebase/firestore';
import SupervosorTasksItem from './SupervosorTasksItem';

const SupervisorTasksScreen = () => {
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
        setData(prev => ({...prev, collection: response.docs, loading: false}));
      })
      .catch(error => {
        console.log(error);
        setData(prev => ({...prev, loading: false}));
      });
  };

  const onPressSupervosorTasksItem = () => {
    console.log('press');
  };

  const renderReqest = useCallback(item => {
    const {id, name, description, from, to, date, status} = item?.item?._data;
    return (
      <SupervosorTasksItem
        id={id}
        name={name}
        description={description}
        from={from}
        to={to}
        date={date}
        status={status}
        onPress={onPressSupervosorTasksItem}
      />
    );
  }, []);

  const keyExtractor = useCallback(item => item.id.toString(), []);

  return (
    <Viewer>
      <Header />
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
        <TouchableOpacity
          style={styles.plusIcon}
          onPress={null}
          activeOpacity={0.8}>
          <PlusIcon />
        </TouchableOpacity>
      </Viewer>
    </Viewer>
  );
};

const styles = StyleSheet.create({
  flatListView: {
    marginVertical: 10,
    marginHorizontal: 16,
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

export default SupervisorTasksScreen;

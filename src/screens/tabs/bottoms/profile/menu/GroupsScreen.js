import React, {useLayoutEffect, useEffect, useState} from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import Viewer from '../../../../../components/views/Viewer';
import {navHeader} from '../../../../../components/bars/navHeader';
import {
  FIRESTORE_COLLECTIONS,
  FIRESTORE_ID,
} from '../../../../../constants/firestore';
import firestore from '@react-native-firebase/firestore';
import {PlusIcon} from '../../../../../assets/icons';
import {APP_COLORS} from '../../../../../constants/colors';
import {APP_ROUTES} from '../../../../../constants/routes';
import {FlatList} from 'react-native-gesture-handler';

const GroupsScreen = props => {
  const [data, setData] = useState({
    loading: true,
    collection: null,
  });

  useLayoutEffect(() => {
    navHeader(props.navigation, 'Группы');
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setData(prev => ({
      ...prev,
      loading: true,
    }));
    await firestore()
      .collection(FIRESTORE_COLLECTIONS.GROUPS)
      .get()
      .then(response => {
        console.log(FIRESTORE_COLLECTIONS.GROUPS, response._docs);
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

  const onPressCreateGroup = () => {
    props.navigation.navigate(APP_ROUTES.CREATE_GROUP_SCREEN);
  };

  const groupItem = item => {
    const {name, lists} = item.item._data;

    return (
      <View style={styles.groupItemStyle}>
        <Text>
          {name}
          {' | '}
          {'Кол-во cтудентов '}
          {lists.length}
        </Text>
      </View>
    );
  };

  return (
    <Viewer loader={data.loading}>
      <FlatList
        data={data.collection}
        renderItem={groupItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        style={styles.plusIcon}
        onPress={onPressCreateGroup}
        activeOpacity={0.8}>
        <PlusIcon />
      </TouchableOpacity>
    </Viewer>
  );
};

const styles = StyleSheet.create({
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
  groupItemStyle: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default GroupsScreen;

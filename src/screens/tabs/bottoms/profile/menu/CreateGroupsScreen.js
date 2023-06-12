import React, {useLayoutEffect, useEffect, useState, useCallback} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  View,
  Modal,
} from 'react-native';
import Viewer from '../../../../../components/views/Viewer';
import {navHeader} from '../../../../../components/bars/navHeader';
import {FIRESTORE_COLLECTIONS} from '../../../../../constants/firestore';
import firestore from '@react-native-firebase/firestore';
import {APP_COLORS} from '../../../../../constants/colors';
import {HEIGHT, WIDTH} from '../../../../../constants/screenDimensions';

const CreateGroupsScreen = props => {
  const [dataSource, setDataSource] = useState({
    loading: true,
    members: null,
    selectedMember: null,
    modalVisible: false,
    loadingGroupsList: false,
    listGroups: [],
  });

  useLayoutEffect(() => {
    navHeader(props.navigation, 'Добавление в группу');
  }, []);

  useEffect(() => {
    getMembers();
    getGroups();
  }, []);

  const getMembers = useCallback(async () => {
    setDataSource(prev => ({
      ...prev,
      loading: true,
    }));

    try {
      const response = await firestore()
        .collection(FIRESTORE_COLLECTIONS.USERS)
        .get();

      const members = response.docs
        .map(doc => doc.data())
        .filter(item => item.role === 1);

      setDataSource(prev => ({
        ...prev,
        members: members,
        loading: false,
      }));
    } catch (error) {
      console.log(error);
      setDataSource(prev => ({
        ...prev,
        loading: false,
      }));
    }
  }, []);

  const getGroups = useCallback(async () => {
    setDataSource(prev => ({
      ...prev,
      loadingGroupsList: true,
    }));

    try {
      const response = await firestore()
        .collection(FIRESTORE_COLLECTIONS.GROUPS)
        .get();

      console.log('FIRESTORE_COLLECTIONS.GROUPS', response._docs);

      setDataSource(prev => ({
        ...prev,
        listGroups: response._docs,
        loadingGroupsList: false,
      }));
    } catch (error) {
      console.log(error);
      setDataSource(prev => ({
        ...prev,
        loadingGroupsList: false,
      }));
    }
  }, []);

  const handleMemberPress = (id, email, full_name) => {
    setDataSource(prev => ({
      ...prev,
      selectedMember: {id, email, full_name},
      modalVisible: true,
    }));
  };

  const addOrRemoveStudentFromGroup = async doc => {
    try {
      const {selectedMember} = dataSource;
      const {full_name, email, id} = selectedMember;

      const groupRef = firestore()
        .collection(FIRESTORE_COLLECTIONS.GROUPS)
        .doc(doc);

      const groupSnapshot = await groupRef.get();
      const groupData = groupSnapshot.data();

      const existingMemberIndex = groupData.lists.findIndex(
        member => member.id === id,
      );

      if (existingMemberIndex > -1) {
        // Member already exists, remove them from the group
        await groupRef.update({
          lists: firestore.FieldValue.arrayRemove(
            groupData.lists[existingMemberIndex],
          ),
        });
      } else {
        // Member does not exist, add them to the group
        await groupRef.update({
          lists: firestore.FieldValue.arrayUnion({full_name, email, id}),
        });
      }

      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const memberItem = useCallback(
    ({item}) => {
      const {email, full_name, id} = item;

      return (
        <TouchableOpacity
          style={styles.memberItem}
          onPress={() => handleMemberPress(id, email, full_name)}>
          <Text style={styles.memberName}>{full_name}</Text>
        </TouchableOpacity>
      );
    },
    [handleMemberPress],
  );

  const closeModal = () => {
    setDataSource(prev => ({
      ...prev,
      modalVisible: false,
    }));
  };

  return (
    <Viewer loader={dataSource.loading}>
      <FlatList
        data={dataSource.members}
        renderItem={memberItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <Modal
        visible={dataSource.modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}>
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() =>
            setDataSource(prev => ({...prev, modalVisible: false}))
          }>
          {dataSource.selectedMember && (
            <TouchableOpacity
              style={styles.modalContent}
              onPress={null}
              activeOpacity={1}>
              <Text>ID: {dataSource.selectedMember.id}</Text>
              <Text>Email: {dataSource.selectedMember.email}</Text>
              <Text>Full Name: {dataSource.selectedMember.full_name}</Text>

              <Viewer
                loader={dataSource.loadingGroupsList}
                style={{
                  marginTop: 20,
                  maxHeight: HEIGHT / 2,
                  flex: undefined,
                  width: WIDTH - 100,
                }}>
                <Text>Список группы:</Text>
                {dataSource.listGroups.map((group, index) => {
                  const {name, lists} = group._data;
                  const doc = group._ref._documentPath._parts[1];
                  console.log('lists', lists);

                  const idExists = lists.some(
                    list => list.id === dataSource.selectedMember.id,
                  );
                  return (
                    <TouchableOpacity
                      style={{
                        padding: 5,
                        borderWidth: 1,
                        borderRadius: 5,
                        marginVertical: 2,
                        borderColor: idExists
                          ? APP_COLORS.PRIMARY
                          : APP_COLORS.BORDER,
                      }}
                      onPress={() => addOrRemoveStudentFromGroup(doc)}>
                      <Text>{name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </Viewer>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeModal}>
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Modal>
    </Viewer>
  );
};

const styles = StyleSheet.create({
  memberItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  grousrItem: {
    backgroundColor: 'red',
    marginVertical: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: APP_COLORS.PRIMARY,
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CreateGroupsScreen;

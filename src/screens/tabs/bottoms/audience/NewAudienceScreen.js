import React, {useLayoutEffect, useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import Viewer from '../../../../components/views/Viewer';
import {navHeader} from '../../../../components/bars/navHeader';
import Input from '../../../../components/inputs/Input';
import {FIRESTORE_COLLECTIONS} from '../../../../constants/firestore';
import firestore from '@react-native-firebase/firestore';
import {APP_COLORS} from '../../../../constants/colors';
import {WIDTH} from '../../../../constants/screenDimensions';
import PrimaryButton from '../../../../components/buttons/PrimaryButton';
import Header from '../../../../components/bars/Header';
import {strings} from '../../../../languages/languages';
import {setFontStyle} from '../../../../utils/setFontStyle';

const NewAudienceScreen = props => {
  const [dataSource, setDataSource] = useState({
    collection: [],
    loading: false,
    audienceActive: '',
    timeActive: '',
    booking: [],
    subject: '',
    groups: [],
    selectedGroups: [],
    choosedMembers: [],
  });

  useEffect(() => {
    getCollection();
    getMember();
  }, []);

  const getMember = async () => {
    await firestore()
      .collection(FIRESTORE_COLLECTIONS.GROUPS)
      .get()
      .then(response => {
        console.log(FIRESTORE_COLLECTIONS.GROUPS, response._docs);
        setDataSource(prev => ({
          ...prev,
          groups: response._docs,
        }));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getCollection = async () => {
    setDataSource(prev => ({...prev, loading: true}));
    await firestore()
      .collection(FIRESTORE_COLLECTIONS.AUDIENCES)
      .get()
      .then(response => {
        console.log('getCollection', response);
        setDataSource(prev => ({
          ...prev,
          collection: response?.docs,
          loading: false,
        }));
      })
      .catch(error => {
        console.log(error);
        setDataSource(prev => ({...prev, loading: false}));
      });
  };

  console.log('dataSource.selectedGroups', dataSource.selectedGroups);

  const getBooking = async (time, conditional) => {
    setDataSource(prev => ({...prev, loading: true}));

    const documentRef = firestore()
      .collection(FIRESTORE_COLLECTIONS.AUDIENCES)
      .doc(dataSource.audienceActive);

    documentRef
      .get()
      .then(documentSnapshot => {
        const booking = documentSnapshot.data();
        const array = booking.booking;

        const index = array.findIndex(element => {
          return element.time === time;
        });

        if (conditional === 'remove') {
          if (array[index].busy === false) {
            setDataSource(prev => ({...prev, loading: false}));
            return;
          }
          array[index] = {
            ...array[index],
            busy: false,
            subject: '',
            groups: [],
          };
        } else if (conditional === 'add') {
          if (array[index].busy === true) {
            setDataSource(prev => ({...prev, loading: false}));
            return;
          }
          array[index] = {
            ...array[index],
            busy: true,
            subject: dataSource.subject,
            groups: dataSource.selectedGroups,
          };
        } else {
          setDataSource(prev => ({...prev, loading: false}));
          return;
        }

        console.log('change ', array[index]);

        documentRef
          .update({
            booking: array,
          })
          .then(() => {
            getCollection();
          })
          .catch(error => {
            console.log(error);
            setDataSource(prev => ({...prev, loading: false}));
          });
      })
      .catch(error => {
        console.log('Error getting document: ', error);
      });
  };

  const onPressChooseAudience = id => {
    setDataSource(prev => ({...prev, audienceActive: id}));
  };

  const onPressRenderTime = (busy, subject, time, index) => {
    if (busy) {
      Alert.alert(
        `Вы уверены, что хотите убрать урок ${subject} в ${time}?`,
        '',
        [
          {
            text: 'Нет',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Да',
            onPress: () => getBooking(time, 'remove'),
            style: 'destructive',
          },
        ],
      );
    } else {
      setDataSource(prev => ({...prev, timeActive: time}));
    }
  };

  const resetState = () => {
    setDataSource(prev => ({...prev, audienceActive: '', timeActive: ''}));
  };

  const onPressChooseMember = name => {
    const existingMember = dataSource.selectedGroups.find(
      group => group.name === name,
    );
    if (existingMember) {
      setDataSource(prev => ({
        ...prev,
        selectedGroups: prev.selectedGroups.filter(
          group => group.name !== name,
        ),
      }));
    } else {
      setDataSource(prev => ({
        ...prev,
        selectedGroups: [...prev.selectedGroups, {name}],
      }));
    }
  };

  const keyExtractor = useCallback(index => {
    return index.toString();
  }, []);

  const renderTime = useCallback(
    (item, index, id) => {
      const {busy, subject, time, members, groups} = item;

      return (
        <RenderTime
          index={index}
          busy={busy}
          subject={subject}
          time={time}
          id={id}
          timeActive={dataSource.timeActive}
          audienceActive={dataSource.audienceActive}
          members={members}
          groups={groups}
          onPress={onPressRenderTime}
        />
      );
    },
    [dataSource.audienceActive, dataSource.timeActive],
  );

  return (
    <Viewer loader={dataSource.loading}>
      <Header label={strings.Аудитория} />
      <Viewer scroll bounces>
        <Input
          placeholder={strings.Предмет}
          style={styles.view}
          getValue={value => setDataSource(prev => ({...prev, subject: value}))}
        />

        <Text style={styles.title}>{strings.Аудитория}</Text>

        {dataSource.collection.map(data => {
          const {number, id, booking} = data?._data;
          const color =
            dataSource.audienceActive === id
              ? APP_COLORS.PRIMARY
              : APP_COLORS.BORDER;

          return (
            <View key={id}>
              <TouchableOpacity
                style={[styles.audienceList, {borderColor: color}]}
                activeOpacity={0.8}
                onPress={() => onPressChooseAudience(id)}>
                <Text>{number}</Text>
              </TouchableOpacity>

              {dataSource.audienceActive === id ? (
                <FlatList
                  data={booking}
                  renderItem={({item, index}) => renderTime(item, index, id)}
                  keyExtractor={(item, index) => `${id}_${index}`}
                  numColumns={4}
                  contentContainerStyle={styles.contentContainer}
                />
              ) : null}
            </View>
          );
        })}
        <Text style={styles.title}>{strings.Ученики}</Text>
        {dataSource.groups.map((group, index) => {
          const {lists, name} = group._data;
          const isSelected = dataSource.selectedGroups.some(
            group => group.name === name,
          );

          return (
            <TouchableOpacity
              key={index}
              onPress={() => onPressChooseMember(name)}
              style={{
                width: WIDTH / 3,
                paddingHorizontal: 8,
                paddingVertical: 8,
                borderWidth: 1,
                marginHorizontal: 16,
                marginVertical: 8,
                borderRadius: 10,
                borderColor: isSelected
                  ? APP_COLORS.PRIMARY
                  : APP_COLORS.BORDER,
              }}>
              <Text>
                {name}
                {' | '}
                {lists.length}
              </Text>
            </TouchableOpacity>
          );
        })}
        <View style={{marginBottom: 80}}></View>
      </Viewer>
      {dataSource.subject !== '' &&
      dataSource.audienceActive &&
      dataSource.timeActive ? (
        <PrimaryButton
          style={styles.button}
          label={strings.Создать}
          onPress={() => getBooking(dataSource.timeActive, 'add')}
        />
      ) : null}
    </Viewer>
  );
};

const RenderTime = ({
  index,
  busy,
  subject,
  time,
  id,
  timeActive,
  audienceActive,
  members,
  groups,
  onPress = () => undefined,
}) => {
  const color = () => {
    if (busy) {
      return 'red';
    }
    if (timeActive === time) {
      return 'blue';
    } else {
      return APP_COLORS.BORDER;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.timeView,
        {
          borderColor: color(),
        },
      ]}
      activeOpacity={0.8}
      onPress={() => onPress(busy, subject, time, index)}>
      <Text>{time}</Text>
      <Text numberOfLines={1}>{subject}</Text>
      {groups && <Text numberOfLines={1}>{groups.length}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingVertical: 10,
  },
  audienceList: {
    marginHorizontal: 16,
    paddingHorizontal: 8,
    marginVertical: 4,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  contentContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  timeView: {
    borderRadius: 10,
    borderWidth: 2,
    marginVertical: 5,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    width: WIDTH / 4.8,
  },
  title: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  button: {
    position: 'absolute',
    width: WIDTH - 32,
    bottom: 10,
  },
  // loadingTime: {marginTop: 20},
  nonFlex: {flex: undefined},
});

export default NewAudienceScreen;

//Оқушыларға жаңа аудитория ашу сағат 12:00 де

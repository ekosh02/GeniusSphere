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

const NewAudienceScreen = props => {
  const [dataSource, setDataSource] = useState({
    collection: [],
    loading: false,
    audienceActive: '',
    timeActive: '',
    booking: [],
    subject: '',
  });

  useEffect(() => {
    getCollection();
  }, []);

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
          array[index] = {...array[index], busy: false, subject: ''};
        } else if (conditional === 'add') {
          if (array[index].busy === true) {
            setDataSource(prev => ({...prev, loading: false}));
            return;
          }
          array[index] = {
            ...array[index],
            busy: true,
            subject: dataSource.subject,
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

  const keyExtractor = useCallback(index => {
    return index.toString();
  }, []);

  const renderTime = useCallback(
    (item, index, id) => {
      const {busy, subject, time} = item;
      return (
        <RenderTime
          index={index}
          busy={busy}
          subject={subject}
          time={time}
          id={id}
          timeActive={dataSource.timeActive}
          audienceActive={dataSource.audienceActive}
          onPress={onPressRenderTime}
        />
      );
    },
    [dataSource.audienceActive, dataSource.timeActive],
  );

  return (
    <Viewer loader={dataSource.loading}>
      <Header label="Аудитория" />
      <Input
        placeholder="Предмет"
        style={styles.view}
        getValue={value => setDataSource(prev => ({...prev, subject: value}))
      }
      />

      <Text style={styles.title}>Аудитория</Text>

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

      {dataSource.subject &&
      dataSource.audienceActive &&
      dataSource.timeActive ? (
        <PrimaryButton
          style={styles.button}
          label="Создать"
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
  onPress = () => undefined,
}) => {
  const color = () => {
    if (busy) {
      return 'red';
    }
    if (timeActive === time) {
      return APP_COLORS.PRIMARY;
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
    bottom: Platform.OS === 'ios' ? 42 : 16,
  },
  // loadingTime: {marginTop: 20},
  nonFlex: {flex: undefined},
});

export default NewAudienceScreen;

import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import Viewer from '../../../../components/views/Viewer';
import Input from '../../../../components/inputs/Input';
import {FIRESTORE_COLLECTIONS} from '../../../../constants/firestore';
import firestore from '@react-native-firebase/firestore';
import {APP_COLORS} from '../../../../constants/colors';
import {WIDTH} from '../../../../constants/screenDimensions';
import PrimaryButton from '../../../../components/buttons/PrimaryButton';
import Header from '../../../../components/bars/Header';
import {strings} from '../../../../languages/languages';
import {useUserProvider} from '../../../../providers/UserProvider';

const NewAudienceScreen = props => {
  const {userData} = useUserProvider();

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
    teachers: [],
    teacherData: {},
  });

  useEffect(() => {
    setDataSource(prev => ({...prev, loading: true}));
    getCollection(false);
    getMember();
    getTeacher();
    setDataSource(prev => ({...prev, loading: false}));
  }, []);

  const getTeacher = async () => {
    await firestore()
      .collection(FIRESTORE_COLLECTIONS.USERS)
      .get()
      .then(response => {
        const teachers = response._docs.filter(
          teacher => teacher._data.role === 2,
        );
        console.log(FIRESTORE_COLLECTIONS.USERS, teachers);
        setDataSource(prev => ({
          ...prev,
          teachers: teachers,
        }));
      })
      .catch(error => {
        console.log(error);
      });
  };

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

  const getCollection = async checkLoading => {
    if (checkLoading) {
      setDataSource(prev => ({...prev, loading: true}));
    }
    await firestore()
      .collection(FIRESTORE_COLLECTIONS.AUDIENCES)
      .get()
      .then(response => {
        console.log('getCollection', response);
        setDataSource(prev => ({
          ...prev,
          collection: response?.docs,
        }));
        if (checkLoading) {
          setDataSource(prev => ({...prev, loading: false}));
        }
      })
      .catch(error => {
        console.log(error);
        if (checkLoading) {
          setDataSource(prev => ({...prev, loading: false}));
        }
      });
  };

  const getBooking = async (time, conditional) => {
    // setDataSource(prev => ({...prev, loading: true}));

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
            teacher: {},
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
            teacher: dataSource.teacherData,
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
            getCollection(true);
          })
          .catch(error => {
            console.log(error);
            setDataSource(prev => ({...prev, loading: false}));
          });
      })
      .catch(error => {
        console.log('Error getting document: ', error);
        setDataSource(prev => ({...prev, loading: false}));
      });
  };

  const isButtonActive = () => {
    const {role} = userData;
    if (role === 1 || role === 2) {
      return true;
    }
    return false;
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
    if (isButtonActive() === true) {
      return;
    }
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

  const onPressChooseTeacher = teacherData => {
    if (isButtonActive() === true) {
      return;
    }
    if (teacherData.id === dataSource.teacherData.id) {
      setDataSource(prev => ({...prev, teacherData: {}}));
      return;
    }
    setDataSource(prev => ({...prev, teacherData: teacherData}));
  };

  const keyExtractor = useCallback(index => {
    return index.toString();
  }, []);

  const renderTime = useCallback(
    (item, index, id) => {
      const {busy, subject, time, members, groups, teacher} = item;
      return (
        <RenderTime
          index={index}
          busy={busy}
          subject={subject}
          time={time}
          id={id}
          teacher={teacher}
          timeActive={dataSource.timeActive}
          audienceActive={dataSource.audienceActive}
          members={members}
          groups={groups}
          onPress={onPressRenderTime}
          isButtonActive={isButtonActive}
        />
      );
    },
    [dataSource.audienceActive, dataSource.timeActive],
  );

  return (
    <Viewer loader={dataSource.loading}>
      <Header label={strings.Аудиторий} />

      {isButtonActive() === true ? null : (
        <Input
          placeholder={strings.Предмет}
          style={styles.view}
          getValue={value => setDataSource(prev => ({...prev, subject: value}))}
        />
      )}

      <Viewer scroll>
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
                  numColumns={3}
                  contentContainerStyle={styles.contentContainer}
                />
              ) : null}
            </View>
          );
        })}
        <Text style={styles.title}>{strings.Педагог}</Text>
        {dataSource.teachers.map((teacher, index) => {
          console.log('teacher', teacher);
          const {full_name, id} = teacher._data;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onPressChooseTeacher(teacher._data)}
              style={{
                width: WIDTH / 3,
                paddingHorizontal: 8,
                paddingVertical: 8,
                borderWidth: 1,
                marginHorizontal: 16,
                marginVertical: 8,
                borderRadius: 10,
                borderColor:
                  dataSource.teacherData.id === id
                    ? APP_COLORS.PRIMARY
                    : APP_COLORS.BORDER,
              }}>
              <Text>{full_name}</Text>
            </TouchableOpacity>
          );
        })}
        <Text style={styles.title}>{strings.Группы}</Text>
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
  teacher,
  isButtonActive,
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

  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }

  const sdjhbchsd = () => {
    if (isButtonActive() === true) {
      return;
    }
    onPress(busy, subject, time, index);
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
      onPress={sdjhbchsd}>
      <Text>{time}</Text>
      <Text numberOfLines={1}>{subject}</Text>
      {teacher &&
        (isEmptyObject(teacher) ? null : (
          <View
            style={{
              marginTop: 10,
              backgroundColor: APP_COLORS.BORDER,
              borderRadius: 6,
              paddingVertical: 5,
              paddingHorizontal: 5,
            }}>
            <Text>
              Педагог:{'\n'}
              {teacher.full_name}
            </Text>
          </View>
        ))}
      {groups &&
        (groups.length === 0 ? null : (
          <View
            style={{
              marginTop: 10,
              backgroundColor: APP_COLORS.BORDER,
              borderRadius: 6,
              paddingVertical: 5,
              paddingHorizontal: 5,
            }}>
            <Text style={{}}>Группа:</Text>
            {groups.map((group, index) => {
              return <Text key={index}>{group.name}</Text>;
            })}
          </View>
        ))}
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
    width: WIDTH / 3.5,
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

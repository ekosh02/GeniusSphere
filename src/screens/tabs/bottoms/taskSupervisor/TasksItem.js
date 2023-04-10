import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {WIDTH} from '../../../../constants/screenDimensions';
import {checkTaskColor} from '../../../../utils/checkTaskColor';
import {checkTaskStatus} from '../../../../utils/checkTaskStatus';
import {setFontStyle} from '../../../../utils/setFontStyle';

const TasksItem = ({id, title, status, onPress = () => undefined}) => {
  return (
    <TouchableOpacity
      style={styles.view}
      onPress={() => onPress(id)}
      activeOpacity={0.8}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View
        style={[styles.statusView, {backgroundColor: checkTaskColor(status)}]}>
        <Text style={styles.statusText}>{checkTaskStatus(status)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    height: 56,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusView: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
  },
  title: {
    width: WIDTH - 142,
    ...setFontStyle(18, '500'),
  },
  statusText: {
    ...setFontStyle(16, '500', 'white'),
  },
});

export default TasksItem;

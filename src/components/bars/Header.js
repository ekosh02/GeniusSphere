import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ArrowBackIcon} from '../../assets/icons';
import {APP_COLORS} from '../../constants/colors';
import {WIDTH} from '../../constants/screenDimensions';
import {setFontStyle} from '../../utils/setFontStyle';

const Header = ({label = 'Экран', routes = ''}) => {
  const navigation = useNavigation();

  const onPressGoBack = () => {
    navigation.replace(routes);
  };

  return (
    <View style={styles.view}>
      {routes !== '' ? (
        <TouchableOpacity style={styles.leftView} onPress={onPressGoBack}>
          <ArrowBackIcon />
          <Text style={styles.leftText}>Назад</Text>
        </TouchableOpacity>
      ) : null}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    backgroundColor: 'white',
    height: Platform.OS === 'ios' ? 86 : 56,
    width: WIDTH,
    borderWidth: 0.5,
    borderColor: APP_COLORS.BORDER,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1,
    shadowOpacity: 0.1,
  },
  label: {
    marginTop: Platform.OS === 'ios' ? 42 : 8,
    ...setFontStyle(28, '600', APP_COLORS.FONT),
  },
  leftView: {
    position: 'absolute',
    left: 4,
    top: Platform.OS === 'ios' ? 44 : 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    height: 32,
    flexDirection: 'row',
  },
  leftText: {
    ...setFontStyle(),
  },
});

export default Header;

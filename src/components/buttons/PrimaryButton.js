import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {setFontStyle} from '../../utils/setFontStyle';
import {APP_COLORS} from '../../constants/colors';
import Loader from '../indicators/Loader';

const PrimaryButton = ({
  label = 'Нажать',
  style = {},
  labelStyle = {},
  loader = false,
  onPress = () => undefined,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={loader ? 1 : 0.8}
      style={[styles.view, style]}
      onPress={loader ? null : onPress}>
      {loader ? (
        <Loader style={styles.loader} color={'white'} />
      ) : (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: APP_COLORS.PRIMARY,
    height: 54,
    marginHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    ...setFontStyle(22, '500', 'white'),
  },
  loader: {
    marginTop: 0,
  },
});

export default PrimaryButton;

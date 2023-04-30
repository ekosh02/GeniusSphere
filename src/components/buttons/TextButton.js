import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {setFontStyle} from '../../utils/setFontStyle';
import {APP_COLORS} from '../../constants/colors';

const TextButton = ({
  label = strings.Нажать,
  style = {},
  size = 16,
  widght = '500',
  loader = false,
  onPress = () => undefined,
}) => {
  return (
    <View style={[styles.view, style]}>
      <TouchableOpacity
        activeOpacity={loader ? 1 : 0.8}
        style={styles.touchable}
        onPress={loader ? null : onPress}>
        <Text
          style={setFontStyle(
            size,
            widght,
            loader ? APP_COLORS.PLACEHOLDER : APP_COLORS.PRIMARY,
          )}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    position: 'absolute',
    height: 38,
    paddingHorizontal: 4,
    minWidth: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TextButton;

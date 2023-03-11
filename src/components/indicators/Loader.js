import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {HEIGHT} from '../../constants/screenDimensions';
import {APP_COLORS} from '../../constants/colors';

const Loader = ({style, color = APP_COLORS.PRIMARY}) => {
  return <ActivityIndicator style={[styles.view, style]} color={color} />;
};

const styles = StyleSheet.create({
  view: {
    marginTop: HEIGHT / 2.6,
  },
});

export default Loader;

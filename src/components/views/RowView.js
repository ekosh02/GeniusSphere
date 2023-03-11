import React from 'react';
import {StyleSheet, View} from 'react-native';

const RowView = ({children, style = {}}) => {
  return <View style={[styles.view, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default RowView;

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {setFontStyle} from '../../utils/setFontStyle';
import { strings } from '../../languages/languages';

const Empty = ({text = strings['Список пуст'], style, textStyle}) => {
  return (
    <View style={[styles.view, style]}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    marginTop: 16,
  },
  text: {
    ...setFontStyle(),
    textAlign: 'center',
  },
});

export default Empty;

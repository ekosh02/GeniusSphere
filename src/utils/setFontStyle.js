import {StyleSheet} from 'react-native';
import {APP_COLORS} from '../constants/colors';

export const setFontStyle = (
  fontSize = 16,
  fontWeight = '400',
  color = APP_COLORS.FONT,
) => {
  const styles = StyleSheet.create({
    font: {
      fontSize,
      fontWeight,
      color,
    },
  });

  return styles.font;
};

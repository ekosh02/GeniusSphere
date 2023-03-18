import {APP_COLORS} from '../../constants/colors';
import { setFontStyle } from '../../utils/setFontStyle';

export function navHeader(navigation, title) {
  navigation.setOptions({
    headerShown: true,
    headerTitleAlign: 'center',
    title: title,
    headerTitleStyle: {
      ...setFontStyle(20, '500'),
    },
    headerTintColor: APP_COLORS.PRIMARY,
  });
}

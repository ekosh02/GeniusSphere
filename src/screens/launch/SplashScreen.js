import React, {useEffect} from 'react';
import Viewer from '../../components/views/Viewer';
import {useNavigation} from '@react-navigation/native';
import {APP_COLORS} from '../../constants/colors';
import {APP_ROUTES} from '../../constants/routes';
import {StyleSheet} from 'react-native';

const SplashScreen = ({navigation = useNavigation()}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace(APP_ROUTES.BOTTOM_TAB);
    }, 1500);
  }, []);

  return <Viewer style={styles.view}></Viewer>;
};

const styles = StyleSheet.create({
  view: {backgroundColor: APP_COLORS.PRIMARY},
});

export default SplashScreen;

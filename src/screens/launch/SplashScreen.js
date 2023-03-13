import React, {useEffect} from 'react';
import Viewer from '../../components/views/Viewer';
import {useNavigation} from '@react-navigation/native';
import {APP_COLORS} from '../../constants/colors';
import {APP_ROUTES} from '../../constants/routes';
import {StyleSheet} from 'react-native';
import {useAuthProvider} from '../../providers/AuthProvider';

const SplashScreen = props => {
  const {isToken} = useAuthProvider();

  useEffect(() => {
    setTimeout(() => {
      if (isToken) {
        props.navigation.replace(APP_ROUTES.BOTTOM_TAB);
      } else {
        props.navigation.replace(APP_ROUTES.SIGN_IN_SCREEN);
      }
    }, 1500);
  }, []);

  return <Viewer style={styles.view}></Viewer>;
};

const styles = StyleSheet.create({
  view: {backgroundColor: APP_COLORS.PRIMARY},
});

export default SplashScreen;

import React, {useEffect} from 'react';
import Viewer from '../../components/views/Viewer';
import {APP_COLORS} from '../../constants/colors';
import {APP_ROUTES} from '../../constants/routes';
import {StyleSheet} from 'react-native';
import {useUserProvider} from '../../providers/UserProvider';

const SplashScreen = props => {
  const {userData} = useUserProvider();

  useEffect(() => {
    setTimeout(() => {
      if (Object.getOwnPropertyNames(userData).length === 0) {
        props.navigation.replace(APP_ROUTES.SIGN_IN_SCREEN);
      } else {
        props.navigation.replace(APP_ROUTES.BOTTOM_TAB);
      }
    }, 1500);
  }, []);

  return <Viewer style={styles.view}></Viewer>;
};

const styles = StyleSheet.create({
  view: {backgroundColor: APP_COLORS.PRIMARY},
});

export default SplashScreen;

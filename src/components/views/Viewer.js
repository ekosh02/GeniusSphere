import React from 'react';
import {View, StyleSheet, Platform, SafeAreaView} from 'react-native';
import Loader from '../indicators/Loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Viewer = ({
  children,
  style = {},
  loader = false,
  loaderStyle = {},
  scroll = false,
  safeArea = false,
  bounces = false,
}) => {
  if (loader) {
    return <Loader style={loaderStyle}/>;
  }

  if (scroll) {
    if (safeArea && Platform.OS === 'ios') {
      return (
        <SafeAreaView style={[styles.view, style]}>
          <KeyboardAwareScrollView bounces={bounces}>
            {children}
          </KeyboardAwareScrollView>
        </SafeAreaView>
      );
    } else {
      return (
        <View style={[styles.view, style]}>
          <KeyboardAwareScrollView bounces={bounces}>
            {children}
          </KeyboardAwareScrollView>
        </View>
      );
    }
  }

  return <View style={[styles.view, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default Viewer;

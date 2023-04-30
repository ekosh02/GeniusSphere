import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {PlusIcon} from '../../../../assets/icons';
import Header from '../../../../components/bars/Header';
import Viewer from '../../../../components/views/Viewer';
import {APP_COLORS} from '../../../../constants/colors';
import {APP_ROUTES} from '../../../../constants/routes';
import { strings } from '../../../../languages/languages';

const AudienceScreen = props => {
  const onPressSupervisorNewAudience = () => {
    props.navigation.navigate(APP_ROUTES.NEW_AUDIENCE_SCREEN, {
      // getCollection: getCollection,
    });
  };
  return (
    <Viewer>
      <Header label={strings.Аудитория} />
      <TouchableOpacity
        style={styles.plusIcon}
        onPress={onPressSupervisorNewAudience}
        activeOpacity={0.8}>
        <PlusIcon />
      </TouchableOpacity>
    </Viewer>
  );
};

const styles = StyleSheet.create({
  flatListView: {
    marginVertical: 10,
  },
  plusIcon: {
    backgroundColor: APP_COLORS.PRIMARY,
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 26,
  },
});

export default AudienceScreen;

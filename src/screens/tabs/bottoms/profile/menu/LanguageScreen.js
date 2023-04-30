import React, {useCallback, useState, useEffect, useLayoutEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Viewer from '../../../../../components/views/Viewer';
import {useUserProvider} from '../../../../../providers/UserProvider';
import {navHeader} from '../../../../../components/bars/navHeader';
import {getStorage, setStorage} from '../../../../../utils/AsyncStorage';
import {APP_KEYS} from '../../../../../constants/keys';
import {APP_ROUTES} from '../../../../../constants/routes';
import {strings} from '../../../../../languages/languages';
import { APP_COLORS } from '../../../../../constants/colors';

const LanguageScreen = props => {
  useLayoutEffect(() => {
    navHeader(props.navigation, strings['Поменять язык']);
  }, []);

  const [current, setSelectedLang] = useState('');

  useEffect(() => {
    getLang();
  }, []);

  const getLang = async () => {
    const lang = await getStorage(APP_KEYS.LANG);
    setSelectedLang(lang);
  };

  const handleLangSelect = async lang => {
    if (lang === current) {
      return;
    }
    await setStorage(APP_KEYS.LANG, lang);
    strings.setLanguage(lang);
    props.navigation.reset({
      index: 0,
      routes: [{name: APP_ROUTES.BOTTOM_TAB}],
    });
  };

  const langs = [
    {lang: 'kz', title: 'Қазақша'},
    {lang: 'ru', title: 'Русский'},
    {lang: 'en', title: 'English'},
  ];

  return (
    <Viewer>
      {langs.map(lang => {
        return (
          <TouchableOpacity
            key={lang.lang}
            onPress={() => handleLangSelect(lang.lang)}
            style={[
              styles.langView,
              lang.lang === current && styles.selectedLangView,
            ]}>
            <Text
              style={[
                styles.langTitle,
                lang.lang === current && styles.selectedLangTitle,
              ]}>
              {lang.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Viewer>
  );
};

const styles = StyleSheet.create({
  langView: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedLangView: {
    backgroundColor: '#eee',
  },
  langTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedLangTitle: {
    color: APP_COLORS.PRIMARY
  },
});

export default LanguageScreen;

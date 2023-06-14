import React, {useState} from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import {HideEyeIcon, ShowEyeIcon} from '../../assets/icons';
import {APP_COLORS} from '../../constants/colors';
import useToggle from '../../hooks/useToggle';
import {setFontStyle} from '../../utils/setFontStyle';
import {strings} from '../../languages/languages';

const Input = ({
  style = {},
  inputStyle = {},
  placeholder = strings['Введите значение'],
  keyboardType = 'default', // number-pad, phone-pad
  secureTextEntry = false,
  multiline = false,
  rightButton = false,
  getValue = () => undefined,
  onPress = () => undefined,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');

  const [hidePassword, setHidePassword] = useToggle(true);

  const onChangeText = value => {
    setValue(value);
    getValue(value);
  };

  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);

  const focusBorderColor = isFocused ? APP_COLORS.PRIMARY : APP_COLORS.BORDER;
  const focusPlaceHolderColor = isFocused
    ? APP_COLORS.PLACEHOLDER
    : APP_COLORS.BORDER;

  return (
    <View style={[styles.view, style]}>
      {secureTextEntry ? (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={setHidePassword}
          activeOpacity={0.5}>
          {hidePassword ? <HideEyeIcon /> : <ShowEyeIcon />}
        </TouchableOpacity>
      ) : null}
      {rightButton ? (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.sendPosition}>Send</Text>
        </TouchableOpacity>
      ) : null}
      <TextInput
        placeholder={placeholder}
        multiline={multiline}
        style={[
          styles.input,
          {borderColor: focusBorderColor, height: multiline ? 148 : 42},
          inputStyle,
        ]}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry && hidePassword}
        placeholderTextColor={focusPlaceHolderColor}
        onChangeText={onChangeText}
        value={value}
        numberOfLines={1}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  eyeIcon: {
    position: 'absolute',
    zIndex: 1,
    right: 22,
    marginTop: 9,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendPosition: {
    position: 'absolute',
    zIndex: 1,
    ...setFontStyle(),
    right: 13,
    marginTop: 8,
  },
});

export default Input;

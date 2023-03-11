import React, {useState} from 'react';
import {TextInput, StyleSheet, View, TouchableOpacity} from 'react-native';
import {HideEyeIcon, ShowEyeIcon} from '../../assets/icons';
import {APP_COLORS} from '../../constants/colors';
import useToggle from '../../hooks/useToggle';

const Input = ({
  style = {},
  inputStyle = {},
  placeholder = 'Введите значение',
  keyboardType = 'default', // number-pad, phone-pad
  secureTextEntry = false,
  getValue = () => undefined,
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
      <TextInput
        placeholder={placeholder}
        style={[styles.input, {borderColor: focusBorderColor}, inputStyle]}
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
    height: 42,
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
});

export default Input;

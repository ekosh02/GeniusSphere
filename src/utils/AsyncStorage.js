import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
    return;
  }
};

export const setStorageObject = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getStorage = async key => {
  try {
    const responce = await AsyncStorage.getItem(key);
    return responce;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getStorageObject = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    console.log('jsonValue', jsonValue);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const removeStorage = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
    return;
  }
};

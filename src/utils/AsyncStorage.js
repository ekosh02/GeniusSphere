import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
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

export const removeStorage = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
    return;
  }
};

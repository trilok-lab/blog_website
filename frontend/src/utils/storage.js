// frontend/src/utils/storage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = async (k, v) => {
  try {
    await AsyncStorage.setItem(k, v);
  } catch (e) {
    console.log("storage set err", e);
  }
};

export const getItem = async (k) => {
  try {
    return await AsyncStorage.getItem(k);
  } catch (e) {
    return null;
  }
};

export const removeItem = async (k) => {
  try {
    await AsyncStorage.removeItem(k);
  } catch (e) {
    console.log("storage remove err", e);
  }
};

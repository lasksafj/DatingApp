import {AsyncStorage} from 'react-native';

const getFromStorage = async (itemName) => {
    try {
        const value = await AsyncStorage.getItem(itemName);
        if (value !== null) {
            return value;
        }
        return '';
    } catch (error) {
        return '';
    }
};

const saveToStorage = async (itemName, content) => {
    try {
        await AsyncStorage.setItem(itemName, content);
        return "thanh cong";
    }
    catch (e) {
        return e;
    }
};

module.exports = {
    getFromStorage,
    saveToStorage
};
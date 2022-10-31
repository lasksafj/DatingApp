//import constants
import * as CST from '../constants/index'
import * as API from '../api/MemoryAndReminderAPI'
import AsyncStorageAccess from '../api/AsyncStorageAccess';
import {dispatch} from '../stores'

export const getAllReminders = (token) => {
    API.getAllReminders(token)
        .then(res => {
            dispatch({
                type: CST.GET_ALL_REMINDERS,
                reminders: res ? res.reminders : []
            });
        })
        .catch(error => {
            console.log(error);
        })
};

export const getAllRemindersType1 = (token) => {
    API.getAllRemindersType1(token)
        .then(res => {
            dispatch({
                type: CST.GET_ALL_REMINDERSTYPE1,
                reminders: res.reminders
            });
        })
        .catch(error => {
            console.log(error);
        })
};


export const addReminder = (token, reminder) => {
    API.addReminder(token, reminder)
        .then(res => {
            dispatch({
                type: CST.ADD_REMINDER,
                reminders: res.reminders
            })
        })
        .catch(error => {
            console.log(error);
        })
}


export const setReminderType1 = (token, reminder) => {
    API.setReminderType1(token, reminder)
        .then(res => {
            dispatch({
                type: CST.SET_REMINDER_TYPE_1,
                reminders: res.reminders
            })
        })
        .catch(error => {
            console.log(error);
        })
};

export const editReminderType1 = (token, reminder) => {
    API.editReminderType1(token, reminder)
        .then(res => {
            dispatch({
                type: CST.EDIT_REMINDER_TYPE_1,
                reminders: res.reminders
            })
        })
        .catch(error => {
            console.log(error);
        })
};

export const cancelReminderType1 = (token, reminderId) => {
    API.cancelReminderType1(token, reminderId)
        .then(res => {
            dispatch({
                type: CST.CANCEL_REMINDER_TYPE_1,
                reminders: res.reminders
            })
        })
        .catch(error => {
            console.log(error);
        })
};

export const addNewReminderType1 = (token, number, unit) => {
    API.addNewAnniversaryMileStone(token, number, unit)
        .then(res => {
            dispatch({
                type: CST.ADD_NEW_REMINDER_TYPE_1,
                reminders: res.reminders
            })
        })
        .catch(error => {
            console.log(error);
        })
};

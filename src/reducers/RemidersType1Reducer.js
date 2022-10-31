//import constants
import * as CST from '../constants/index'

const remindersType1Reducer = (state = [], action) => {
    let newReminders = state.reminders;

    switch (action.type) {
        case CST.GET_ALL_REMINDERSTYPE1:
            return action.reminders;
        case CST.SET_REMINDER_TYPE_1:
            return action.reminders;
        case CST.EDIT_REMINDER_TYPE_1:
            return action.reminders;
        case CST.CANCEL_REMINDER_TYPE_1:
            return action.reminders;
        case CST.ADD_NEW_REMINDER_TYPE_1:
            return action.reminders;
    }

    return state;
};

export default remindersType1Reducer;
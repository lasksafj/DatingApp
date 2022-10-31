//import constants
import * as CST from '../constants/index'

const remindersReducer = (state = [], action) => {
    let newReminders = state.reminders;

    switch (action.type) {
        case CST.GET_ALL_REMINDERS:
            return action.reminders;
        case CST.ADD_REMINDER:
            return action.reminders;
        case CST.SET_REMINDER_TYPE_1:
            return action.reminders;
    }

    return state;
};

export default remindersReducer;
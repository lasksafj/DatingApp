/**
 * Created by XuanVinh on 8/7/2017.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Platform,
    TextInput,
    Text,
    TouchableOpacity,
    FlatList,
    View
} from 'react-native';

import {connect} from 'react-redux';

//import components
import Reminders from './Reminders'

//import actions
import {deleteReminder, editReminder, getAllReminders} from '../../../../actions/reminderAction'

const RemindersContainer = connect(
    state => {
        return {
            reminders: state.reminders,
            user: state.authentication.user,
        }
    },
    dispatch => {
        return {
            getAllReminders: () => getAllReminders(),
        }
    }
)(Reminders)

export default RemindersContainer;
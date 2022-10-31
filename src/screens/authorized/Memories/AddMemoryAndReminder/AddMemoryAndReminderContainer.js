/**
 * Created by XuanVinh on 8/7/2017.
 */

import React, {Component} from 'react';

import {connect} from 'react-redux';

//import components
import AddMemoryAndReminderComponent from './AddMemoryAndReminderComponent'

const AddMemoryAndReminderContainer = connect(
    state => {
        return {
            remindersType1: state.remindersType1
        }
    },
    dispatch => {
        return {}
    }
)(AddMemoryAndReminderComponent);

export default AddMemoryAndReminderContainer;
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
import Memories from './Memories'

//import actions

const MemoriesContainer = connect(
    state => {
        console.log("container", state);
        return {
            memories: state.memories,
            user: state.authentication.user,
            target: state.authentication.target
        }
    },
    dispatch => {
        return {}
    }
)(Memories)

export default MemoriesContainer;
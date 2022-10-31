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

//import components
import Reminder from './Reminder'

import {getAllReminders} from '../../../../actions/reminderAction'
import {dispatch} from '../../../../stores'

export default class Reminders extends Component{

    constructor(props){
        super(props);
        this.state = {
            reminders: []
        }
    }

    componentWillMount(){
        getAllReminders();
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            reminders: nextProps.reminders
        })
    }

    _renderItem = ({item}) => (
        <Reminder reminder={item} />
    );

    _keyExtractor = (item, index) => item._id;

    render(){
        return(
            <View style={styles.container}>
                <FlatList
                    data={this.state.reminders}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
    }
})
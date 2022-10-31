/**
 * Created by XuanVinh on 8/7/2017.
 */
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

//import components
import AddReminderType2 from './AddReminderType2/AddReminderType2'
import AddReminderType1 from './AddReminderType1/AddReminderType1'

//import containers
import AddMemoryContainer from './AddMemory/AddMemoryContainer'


export default class AddMemoryAndReminderBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addingMemory: true,
            addingRemindDate: false,
            addingRemindCelebration: false,
            memory: {}
        };

        this._onChooseAddMemory = this._onChooseAddMemory.bind(this);
        this._onChooseAddRemindDate = this._onChooseAddRemindDate.bind(this);
        this._onChooseAddRemindCelebration = this._onChooseAddRemindCelebration.bind(this);
    }

    _onChooseAddMemory() {
        if (!this.state.addingMemory) {
            this.setState({
                addingMemory: true,
                addingRemindDate: false,
                addingRemindCelebration: false
            })
        }
    }

    _onChooseAddRemindDate() {
        if (!this.state.addingRemindDate) {
            this.setState({
                addingMemory: false,
                addingRemindDate: true,
                addingRemindCelebration: false
            })
        }
    }

    _onChooseAddRemindCelebration() {
        if (!this.state.addingRemindCelebration) {
            this.setState({
                addingMemory: false,
                addingRemindDate: false,
                addingRemindCelebration: true
            })
        }
    }


    render() {
        const addingMemory = this.state.addingMemory;
        const addingRemindDate = this.state.addingRemindDate;
        const addingRemindCelebration = this.state.addingRemindCelebration;


        let addBox;
        if (addingMemory) {
            addBox = <AddMemoryContainer navigation={this.props.navigation}/>;
        }
        if (addingRemindDate) {
            addBox = <AddReminderType2 navigation={this.props.navigation} addReminder={this.props.addReminder}/>;
        }
        if (addingRemindCelebration) {
            addBox = <AddReminderType1 navigation={this.props.navigation} remindersType1={this.props.remindersType1}/>;
        }

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this._onChooseAddMemory}
                                      style={[addingMemory ? styles.headerChosenItem : styles.headerItem, styles.headerLeftItem]}>
                        <Text style={addingMemory ? styles.whiteText : null}>Kỷ niệm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onChooseAddRemindDate}
                                      style={[addingRemindDate ? styles.headerChosenItem : styles.headerItem]}>
                        <Text style={addingRemindDate ? styles.whiteText : null}>Hẹn hò</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onChooseAddRemindCelebration}
                                      style={[addingRemindCelebration ? styles.headerChosenItem : styles.headerItem, styles.headerRightItem]}>
                        <Text style={addingRemindCelebration ? styles.whiteText : null}>Ăn mừng</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.addBox}>
                    {addBox}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header: {
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row',
        height: 35,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#4CAF50',
        elevation: 5
    },
    headerItem: {
        flex: 1,
        backgroundColor: "#E0E0E0",
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerChosenItem: {
        flex: 1,
        backgroundColor: "#4CAF50",
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerLeftItem: {
        borderBottomLeftRadius: 8,
        borderTopLeftRadius: 8
    },
    headerRightItem: {
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8
    },
    whiteText: {
        color: 'white'
    },
    addBox: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5
    }
})
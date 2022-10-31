/**
 * Created by XuanVinh on 8/15/2017.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Platform,
    TextInput,
    Text,
    TouchableOpacity,
    View,
    Button
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import Hr from 'react-native-hr'
import AsyncStorageAccess from '../../../../../api/AsyncStorageAccess';

//import actions
import {addReminder} from '../../../../../actions/reminderAction'

export default class AddReminderType2 extends Component {
    constructor(props){
        super(props);

        this.state = {
            reminder: {
                content: "",
                alertBefore: "",
                remindDateTime: "",
                reminderType: 0,
                backgroundImage: ""
            },
        }

        this._onAddReminderDate = this._onAddReminderDate.bind(this);
    }

    _onAddReminderDate() {
        let reminder = this.state.reminder;
        reminder.reminderType = 2;
        reminder.backgroundImage = "https://www.google.com/permissions/images/maps-att.png";
        AsyncStorageAccess.getFromStorage('@loginToken')
            .then(token => {
                addReminder(token, reminder);
                this.props.navigation.navigate('AuthenStackNav');
            });
    }

    render(){
        return(
            <View>
                <DatePicker
                    style={{width: "100%"}}
                    date={this.state.reminder.remindDateTime}
                    mode="datetime"
                    placeholder="Chọn lịch hẹn"
                    format="DD-MM-YYYY HH:mm"
                    minDate="07-08-2017"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                    dateInput: {
                        borderWidth: 0,
                        alignItems: "flex-start",
                        marginLeft: 5
                    }
                }}
                    onDateChange={(date) => {
                    let reminder = this.state.reminder;
                    reminder.remindDateTime = date;
                    this.setState({
                        reminder: reminder
                    })
                }}

                />
                <Hr lineColor='#B0BEC5'/>
                <TextInput
                    style={styles.textInput}
                    underlineColorAndroid={'transparent'}
                    multiline={true}
                    numberOfLines={5}
                    placeholder={'Bạn muốn làm gì?'}
                    placeholderTextColor={'#c9c9c9'}
                    onChangeText={(text)=>{
                    let reminder = this.state.reminder;
                    reminder.content = text;
                    this.setState({
                        reminder: reminder
                    })
                }}
                    value={this.state.reminder.content}
                />
                <Hr lineColor='#B0BEC5'/>
                <Text style={styles.inputTitle}>Báo trước (giờ)</Text>
                <TextInput
                    style={[styles.textInput]}
                    underlineColorAndroid={'transparent'}
                    placeholder={'Nhập giờ'}
                    placeholderTextColor={'#c9c9c9'}
                    keyboardType="numeric"
                    onChangeText={(text)=>{
                    let reminder = this.state.reminder;
                    reminder.alertBefore = text;
                    this.setState({
                        reminder: reminder
                    })
                }}
                    value={this.state.reminder.alertBefore}
                />
                <Button
                    onPress={this._onAddReminderDate}
                    title={"Hoàn tất"}
                    color="#F06292"
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 0,
        textAlignVertical: 'top',
        fontSize: 16
    },
    inputTitle: {
        marginLeft: 5,
        color: "black",
        fontSize: 16
    },
    hourInputContainer: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'flex-start'
    }
})
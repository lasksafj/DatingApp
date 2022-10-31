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
    View,
    Image
} from 'react-native';
import moment from 'moment'

export default class Reminder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reminder: {
                _id: "",
                content: "",
                countDownAt: "",
                remindDateTime: "",
                created_at: "",
                reminderType: {number: 0, name: ""},
                backgroundImage: "",
                mileStone: {
                    number: 0,
                    unit: ""
                }
            },
            daysLeft: 0,
            hoursLeft: 0,
            minsLeft: 0,
            secondsLeft: 0,
            intervalId: 0
        };

        this.refreshTimeLeft = this.refreshTimeLeft.bind(this);
    }

    componentWillMount() {
        const time = moment(this.props.reminder.remindDateTime, "DD-MM-YYYY HH:mm");
        var seconds = time.diff(moment()) / 1000;
        var days = Math.floor(seconds / 86400);
        seconds = seconds % 86400;
        var hours = Math.floor(seconds / 3600);
        seconds = seconds % 3600;
        var mins = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        var intervalId = setInterval(this.refreshTimeLeft, 1000);
        this.setState({
            reminder: this.props.reminder,
            intervalId: intervalId,

            daysLeft: days,
            hoursLeft: hours,
            minsLeft: mins,
            secondsLeft: seconds
        })
    }

    refreshTimeLeft() {
        const time = moment(this.state.reminder.remindDateTime, "DD-MM-YYYY HH:mm");
        let seconds = time.diff(moment()) / 1000;
        if (seconds < 0) {
            clearInterval(this.state.intervalId);
        } else {
            var days = Math.floor(seconds / 86400);
            seconds = seconds % 86400;
            var hours = Math.floor(seconds / 3600);
            seconds = seconds % 3600;
            var mins = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);

            this.setState({
                daysLeft: days,
                hoursLeft: hours,
                minsLeft: mins,
                secondsLeft: seconds
            })
        }
    }

    render() {
        const reminder = this.state.reminder;
        return (
            <Image
                source={{uri: reminder.backgroundImage}}
                style={styles.reminderBackground}
            >
                <View style={styles.reminderContainder}>
                    <Text style={styles.content}>{reminder.content}</Text>
                    <View style={styles.dateContainer}>
                        <Text style={styles.date}>{reminder.remindDateTime}</Text>
                        <View style={styles.countDownAlign}>
                            <Text
                                style={styles.countDown}>{this.state.daysLeft > 0 ? " " + this.state.daysLeft + " ngày " : " "}
                                {this.state.hoursLeft < 10 ? "0" + this.state.hoursLeft : this.state.hoursLeft}:
                                {this.state.minsLeft < 10 ? "0" + this.state.minsLeft : this.state.minsLeft}:
                                {this.state.secondsLeft < 10 ? "0" + this.state.secondsLeft : this.state.secondsLeft}</Text>
                        </View>
                    </View>
                </View>
            </Image>
        )
    }
}

const styles = StyleSheet.create({
    reminderBackground: {
        // minHeight: 50,
        marginTop: 5,
    },
    reminderContainder: {
        padding: 5,
        justifyContent: "center",
        minHeight: 50,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    content: {
        color: '#F06292',
        fontSize: 18
    },
    dateContainer: {
        flexDirection: "row",
    },
    date: {
        color: 'white',
        flex: 1
    },
    countDown: {
        color: "white",
    },
    countDownAlign: {
        flex: 1,
        alignItems: "flex-end"
    },
    pinkText: {
        color: '#F06292',
    }
})
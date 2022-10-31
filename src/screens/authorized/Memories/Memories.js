import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Button,
    ScrollView,
    RefreshControl
} from 'react-native';
import AsyncStorageAccess from '../../../api/AsyncStorageAccess';

//Import containers
import RemindersContainer from './Reminders/RemindersContainer'
import MemoriesContainer from './Memories/MemoriesContainer'

import {dispatch} from '../../../stores'
import {getAllReminders} from '../../../actions/reminderAction'
import {getLast5Memories} from '../../../actions/memoryAction'

export default class Memories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memories: [],
            refreshing: false,
            token: ""
        }
    }

    componentWillMount() {
        AsyncStorageAccess.getFromStorage('@loginToken')
            .then(token => {
                getAllReminders(token);
                getLast5Memories(token);
                this.setState({
                    token: token
                })
            });
    }


    render() {
        // console.log(123123, this.props);
        return (
            <View style={styles.container}>
                <Button
                    onPress={() => {
                        this.props.navigation.navigate('AddMemoryAndReminder');
                    }}
                    title={"Thêm mới"}
                    color="#F06292"

                />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => {
                                this.setState({
                                    refreshing: true
                                });
                                getLast5Memories(this.state.token);
                                this.setState({
                                    refreshing: false
                                })
                            }}
                            refreshing={this.state.refreshing}
                        />
                    }
                >
                    <RemindersContainer/>
                    <MemoriesContainer/>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
    }
})
/**
 * Created by XuanVinh on 8/13/2017.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image
} from 'react-native';
import moment from 'moment'
import AsyncStorageAccess from '../../../../api/AsyncStorageAccess';
import Icon from 'react-native-vector-icons/FontAwesome';

//import actions
import {loveMemory} from '../../../../actions/memoryAction'

//import APIs
import * as API from '../../../../api/MemoryAndReminderAPI'

export default class MemoryAvatarAndText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            personPost: {
                id: 0,
                firstName: "",
                lastName: "",
                avatar: ""
            },
            memory: {}
        };
        this.loveMemory = this.loveMemory.bind(this);
    }

    componentWillMount() {
        let personPost;
        let memory = this.props.memory;
        // const createdDate = memory.created_at;
        // memory.created_at = moment(createdDate, "D")
        AsyncStorageAccess.getFromStorage('@loginToken')
            .then(token => {
                if (memory.userId === memory.user.id) {
                    this.setState({
                        personPost: memory.user,
                        memory: memory,
                        token: token
                    })
                } else {
                    this.setState({
                        personPost: memory.target,
                        memory: memory,
                        token: token

                    })
                }
            });
    }

    loveMemory() {
        let memory = this.state.memory;
        API.loveMemory(this.state.token, memory._id);
        const index = memory.loved.indexOf(memory.user._id);
        if (index !== -1) {
            if (memory.loved.length === 1) {
                memory.loved = [];
            } else {
                memory.loved = memory.loved.slice(index, index + 1);
            }
        } else {
            memory.loved.push(memory.user._id);
        }

        this.setState({
            memory: memory
        })
    }

    render() {
        const personPost = this.state.personPost;
        const memory = this.state.memory;
        let loveIcon = <Icon name="heart-o" size={40} color="#F06292"/>
        if (memory.loved && memory.loved.indexOf(memory.user._id) !== -1) {
            loveIcon = <Icon name="heart" size={40} color="#F06292"/>
        }

        return (<View style={styles.container}>
            <View style={styles.memoryTop}>
                <View style={styles.personPost}>
                    <Image
                        source={{uri: personPost.avatar}}
                        style={styles.avatar}
                    />
                    <View style={styles.nameAndTime}>
                        <Text style={styles.name}>{personPost.displayName}</Text>
                        <Text>{memory.created_at}</Text>
                    </View>
                </View>
                <View style={styles.loveCorner}>
                    <TouchableOpacity
                        onPress={() => {
                            this.loveMemory();
                        }}
                    >
                        {loveIcon}
                    </TouchableOpacity>
                </View>
            </View>

            <View>
                <Text>{memory.text}</Text>
            </View>
        </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 10
    },
    personPost: {
        flexDirection: 'row',
        marginBottom: 10,
        flex: 8
    },
    avatar: {
        height: 50,
        width: 50
    },
    nameAndTime: {
        justifyContent: 'center',
        flexDirection: "column",
        marginLeft: 5
    },
    name: {
        fontWeight: 'bold'
    },
    memoryTop: {
        flexDirection: 'row'
    },
    loveCorner: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
import React, {Component} from 'react';
import {
    View, Text, TextInput,
    TouchableOpacity, StyleSheet, Dimensions,
    FlatList, Image
} from 'react-native';
import avatar from '../media/temp/avatar1.jpg';
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('window');

class SearchFriends extends Component {

    static navigationOptions = {
        title: 'Find friend',
    };

    constructor(props) {
        super(props);
        this.state = {
            searchName: '',
            friendList: [],
            notifications: [],
        }
    }

    _keyExtractor = (item, index) => item._id;

    render() {

        const {friendList} = this.state;
        const {socket} = this.props;
        const {wrapper, container, inputTextBox, row_list, avatarStyle, addButton, name} = styles;

        return (
            <View style={wrapper}>
                <View style={container}>
                    <TextInput
                        style={inputTextBox}
                        underlineColorAndroid={'transparent'}
                        placeholder="Nhập tên bạn bè!"
                        onChangeText={text => {
                            console.log(text);
                            socket.emit('client-send-search-name', text);
                            socket.on('server-send-friend-list', data => {
                                console.log('data', data);
                                this.setState({friendList: data});
                            });
                        }}
                    />
                    <Text>Danh sach</Text>
                </View>
                <FlatList
                    data={friendList}
                    keyExtractor={this._keyExtractor}
                    renderItem={({item}) => (
                        <View
                            style={row_list}
                        >
                            <Image source={avatar} style={avatarStyle}/>
                            <Text style={name}>{item.displayName}</Text>
                            <TouchableOpacity
                                style={addButton}
                                onPress={() => socket.emit('SendFriendRequest', item)}
                            >
                                <Text>Thêm bạn</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        marginTop: 10,
        alignItems: 'center',
    },
    inputTextBox: {
        marginTop: 20,
        width: width / 3 * 2,
        backgroundColor: '#CECECE',
        borderRadius: 5,
        justifyContent: 'center'
    },
    row_list: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 10,
        borderBottomWidth: 0.5,
        borderColor: 'gray',
    },
    avatarStyle: {
        height: 50,
        width: 50,
        borderRadius: 25,
    },
    name: {
        fontSize: 15,
        fontWeight: '200',
        marginLeft: 20
    },
    addButton: {
        marginRight: 10,
        borderWidth: 0.5,
        padding: 5,
        borderColor: 'gray',
    }
});

function mapStateToProps(state) {
    console.log('user: ', state.authentication.user);
    console.log('target: ', state.authentication.target);
    console.log('socket: ', state.socket.socket);
    return {
        user: state.authentication.user,
        target: state.authentication.target,
        socket: state.socket.socket
    }
}

export default connect(mapStateToProps)(SearchFriends);

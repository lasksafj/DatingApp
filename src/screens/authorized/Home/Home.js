/**
 * Created by minhphan on 7/14/2017.
 */
import React, {Component} from 'react';
import {
    View, Text, TouchableOpacity, FlatList, TextInput,
    Image, StyleSheet, Dimensions, Modal, TouchableHighlight
} from 'react-native';
import {connect} from 'react-redux';
import {AccessSocket} from '../../../actions/Socket';
import {storeTarget, storeCoupleStatus} from '../../../actions/Authen';
import {convertMS} from '../../../common/functions';
import getTargetOfUser from '../../../api/authen/GetTargetOfUser';
import PushNotification from 'react-native-push-notification';

import getCoupleInfo from'../../../api/profile/getCoupleInfo';
import AsyncStorageAccess from '../../../api/AsyncStorageAccess';
import addFriend from '../../../media/icons/user.png';
import addFriendWhite from '../../../media/icons/addFriendWhite.png';
import icon_back from '../../../media/icons/icon_left_arrow.png';
import icon_search from '../../../media/icons/icon_search_white.png';
import hinh from '../../../media/temp/avatar1.jpg';
import icon_add_heart from '../../../media/icons/icon_add_heart.png';
import ring from '../../../media/icons/ring.jpg';

const {width, height} = Dimensions.get('window');
let startTime;
class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            requestFriendContent: '',
            targetId: '',
            modalVisible: false,
            searchFriendModal: false,
            targetStatus: '',
            searchName: '',
            friendList: [],
            notifications: [],
            startTime: null,
            curTime: 0,
            year: 0,
            month: 0,
            day: 0,
            hour: 0,
            minute: 0,
            second: 0,
            slogan: '',
        };
    }

    componentWillMount() {
        startTime = new Date().getTime();
//-------------------------------------Push notifications----------------------------------------
        PushNotification.configure({
            onRegister: function (token) {
                console.log('TOKEN:', token);
            },
            onNotification: function (notification) {
                console.log('NOTIFICATION:', notification);
            },
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
            popInitialNotification: true,
            requestPermissions: true,
        });

        this.props.socket.on('incomingCall', (data) => {
            if (data.type === 'videoCall') {
                this.props.navigation.navigate('CallHandleScreen', {
                    type: 'callee',
                    content: 'videoCall',
                })
            }
            else if (data.type === 'audioCall') {
                this.props.navigation.navigate('CallHandleScreen', {
                    type: 'callee',
                    content: 'audioCall',
                })
            }
            if (AppState.currentState === 'background') {
                PushNotification.localNotification({
                    subText: this.props.target.displayName,
                    message: 'Incoming Call',
                    autoCancel: true,
                });
            }
        });

        this.props.socket.on('ReceiveMessage', (data) => {
            if (AppState.currentState === 'background') {
                console.log(data);
                if (this.props.screen !== 'ChatTabView') {
                    this.props.navigation.navigate('ChatTabView');
                }
                PushNotification.localNotification({
                    subText: data[0].user.name,
                    message: data[0].text? data[0].text : data[0].image.type==='uri'? 'received pictures' : 'received a sticker',
                    autoCancel: true,
                });
            }
            else if (AppState.currentState === 'active') {
                console.log(this.props.user, 'new message from', this.props.target);
            }
        });
//-------------------------------------End Push notifications----------------------------------------
    }


    componentDidMount() {
        this.props.socket.on('LoadRequestFriend', request => {
            console.log('request', request);
            if (request.length > 0) {
                this.setState({
                    requestFriendContent: request[0].container,
                    targetId: request[0].targetId
                });
            }
        });
        this.checkTarget(this.props.target);
        AsyncStorageAccess.getFromStorage('@loginToken')
            .then(token => {
                if (token === '') {
                    this.props.navigation.navigate('UnauthenStackNav')
                } else {
                    getCoupleInfo(token)
                        .then(res => {
                            this.props.storeCoupleStatus(res.info);
                            this.setState({
                                slogan: res.info.slogan
                            });
                            let startTime = new Date(parseInt(res.info.startTime)).getTime();
                            setInterval(() => {
                                let msec = new Date().getTime() - startTime;
                                let {second, minute, hour, day} = convertMS(msec);
                                this.setState({second, minute, hour, day})
                            }, 1000);
                        });
                }
            })
    }

    sendConfirmFriend() {
        this.props.socket.emit('ConfirmFriendRequest', this.state.targetId);
        this.props.socket.on('ConfirmFriendRequest', response => {
            if (response.status === true) {
                AsyncStorageAccess.getFromStorage('@loginToken')
                    .then(token => {
                        getTargetOfUser(token)
                            .then(target => {
                                if (target) {
                                    this.props.storeTarget(target.target);
                                    this.checkTarget(target.target);
                                    this.setState({modalVisible: false});
                                }
                            })
                    });
            }
        });
    }

    checkTarget(target) {
        if (target !== null) {
            if (target.targetId === null) {
                this.setState({targetStatus: 'NO_TARGET'})
            } else {
                if (target.status === 'pending') {
                    this.setState({targetStatus: "PENDING"})
                } else {
                    this.setState({targetStatus: "ACCEPTED"});
                }
            }
        }
    }

    _keyExtractor = (item, index) => item._id;

    render() {
        const {user, target, socket} = this.props;
        const {requestFriendContent, targetStatus, friendList, minute, second, hour, day, slogan} = this.state;
        const {
            wrapper, row, avatar, btnModal, modalContent, status, container, circleCenter, topImage,
            addWrapper, addTextInput, addList, addAvatar, addBtn, center, dayCounterWrapper, dayCounter, currentDay, time,
            avatarWrapper, userAvatarWrapper, userDisplayName
        } = styles;

        const modal = (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    alert("Modal has been closed.")
                }}
            >
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={modalContent}>
                        <Text>{requestFriendContent} muốn kết bạn</Text>
                        <Text/>
                        <Text/>
                        <TouchableHighlight
                            style={btnModal}
                            onPress={this.sendConfirmFriend.bind(this)}>
                            <Text style={{color: '#fff'}}>Xác Nhận</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={btnModal}
                            onPress={() => this.setState({modalVisible: false})}>
                            <Text style={{color: '#fff'}}>Hủy</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );

        const targetView = () => {
            switch (targetStatus) {
                case 'NO_TARGET':
                    return (
                        <TouchableOpacity
                            onPress={() => this.setState({searchFriendModal: true})}
                        >
                            <Image source={addFriend} style={avatar}/>
                        </TouchableOpacity>
                    );
                case 'PENDING':
                    return (
                        <TouchableOpacity
                            onPress={() => this.setState({modalVisible: true})}
                        >
                            <Image source={addFriendWhite} style={avatar}/>
                        </TouchableOpacity>
                    );
                default:
                    return (
                        <View style={{backgroundColor: '#fff', alignItems: 'center', padding: 10}}>
                            <Image source={{uri: target.avatar}} style={avatar}/>
                            <Text style={{marginTop: 8, fontSize: 16, fontWeight: "bold"}}>{target.displayName}</Text>
                        </View>
                    )
            }
        };

        const SearchFriendModal = (
            <Modal
                animationType={'slide'}
                transparent={false}
                visible={this.state.searchFriendModal}
                onRequestClose={() => {
                    alert("Modal has been closed.")
                }}
            >
                <View style={{flex: 1}}>
                    <View style={addWrapper}>
                        <TouchableOpacity
                            onPress={() => this.setState({searchFriendModal: false, friendList: []})}
                        >
                            <Image source={icon_back} style={{width: 24, height: 24}}/>
                        </TouchableOpacity>
                        <TextInput
                            style={addTextInput}
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
                        <TouchableOpacity
                        >
                            <Image source={icon_search} style={{width: 24, height: 24}}/>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={friendList}
                        keyExtractor={this._keyExtractor}
                        renderItem={({item}) => (
                            <View style={addList}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image source={hinh} style={addAvatar}/>
                                    <Text style={{marginLeft: 10}}>{item.displayName}</Text>
                                </View>

                                <TouchableOpacity
                                    style={addBtn}
                                    onPress={() => socket.emit('SendFriendRequest', item)}
                                >
                                    <Image source={icon_add_heart} style={{width: 20, height: 20, marginRight: 5}}/>
                                    <Text>Thêm bạn</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            </Modal>
        );

        return (
            <View style={wrapper}>
                <Text style={status}>{slogan}</Text>
                <View style={container}>
                    <View style={circleCenter}>
                    </View>
                    <View style={{position: 'absolute', height: height}}>
                        <Image source={ring} style={topImage}/>
                        <View style={dayCounterWrapper}>
                            <Text style={dayCounter}>{day}</Text>
                            <Text style={time}>{hour} : {minute} : {second}</Text>
                            <Text style={currentDay}>{new Date().toLocaleDateString()}</Text>

                        </View>
                    </View>
                    <View style={avatarWrapper}>
                        <View style={userAvatarWrapper}>
                            <Image source={user.avatar !== null ? {uri: user.avatar} : addFriend } style={avatar}/>
                            <Text style={userDisplayName}>{user.displayName}</Text>
                        </View>
                        {targetView()}
                    </View>
                </View>
                <View style={{marginTop: width / 8, width: width * 3 / 4, height: 10, backgroundColor: 'green'}}>
                </View>
                {SearchFriendModal}
                {modal}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.authentication.user,
        target: state.authentication.target,
        socket: state.socket.socket,
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50
    },
    avatarWrapper: {
        flexDirection: 'row',
        width: width,
        justifyContent: 'space-between',
        paddingHorizontal: width / 15,
        position: 'absolute',
        paddingBottom: 40
    },
    userAvatarWrapper: {
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 10
    },
    userDisplayName: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: "bold"
    },
    circleCenter: {
        width: width / 3 * 2,
        height: width / 3 * 2,
        borderRadius: width / 3,
        borderWidth: 4,
        borderColor: 'red',
    },
    topImage: {
        width: width / 6,
        height: width / 6,
        marginTop: height / 2 - width * 5 / 12,
        padding: 8
    },
    dayCounterWrapper: {
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: width / 2,
        backgroundColor: '#fff'
    },
    dayCounter: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FC4BA5'
    },
    currentDay: {
        fontSize: 13
    },
    time: {
        fontSize: 15
    },
    backgroundImage: {
        flex: 1,
        width: width
    },
    row: {
        marginTop: 100,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    avatar: {
        width: width / 4,
        height: width / 4,
        borderRadius: width / 8,
    },
    status: {
        fontSize: 20,
        marginBottom: width / 12
    },
    btnModal: {
        backgroundColor: '#39A9D2',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 30,
        borderRadius: 10,
    },
    modalContent: {
        width: width - 50,
        height: 50,
        backgroundColor: '#fff',
        flexDirection: 'row',
        borderRadius: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    inputTextBox: {
        marginTop: 20,
        width: width / 3 * 2,
        backgroundColor: '#CECECE',
        borderRadius: 5,
        justifyContent: 'center'
    },

    addWrapper: {
        flexDirection: 'row',
        backgroundColor: '#A721B3',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addTextInput: {
        width: width / 3 * 2,
        height: 32,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginHorizontal: 10,
        paddingBottom: 2,
    },
    addList: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: '#ECEFF1',
        justifyContent: 'space-between'
    },
    addAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 10,
        marginVertical: 4
    },
    addBtn: {
        marginRight: 10,
        flexDirection: 'row',
        borderWidth: 0.5,
        backgroundColor: '#B4DCF1',
        padding: 5,
        borderRadius: 5,
    },
});

export default connect(mapStateToProps, {AccessSocket, storeTarget, storeCoupleStatus})(Home);

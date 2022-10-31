import React, {Component} from 'react';
import {
    View, InteractionManager, TouchableOpacity,
    Keyboard, Image, Text
} from 'react-native';
import {connect} from 'react-redux';
import {GiftedChat, Composer} from 'react-native-gifted-chat';
import {storeCoupleStatus} from '../../../actions/Authen';
import CustomActions from './CustomActions';
import MoreActions from './MoreActions';
import ImagePicker from 'react-native-image-picker';
import EmojiPicker from './EmojiPicker'
import GifyPicker from './Gify'
import uuid from 'uuid';

import icon_videoCall from '../../../media/icons/icon_videoCall.png';
import icon_phoneCall from '../../../media/icons/icon_phoneCall.png';
import dot_white from '../../../media/icons/dot_white.png';
import icon_Typing from '../../../media/icons/typing.gif';
import icon_back from '../../../media/icons/icon_back_black.png';

let con;
class ChatScreen extends Component {

    static navigationOptions = ({navigation}) => ({

        title: "Chat",
        tabBarVisible: false,
        header: null,
        // headerStyle: {
        //     backgroundColor: '#C13BCE',
        // },
        // headerRight: (
        //     <View style={{flexDirection: 'row', alignItems: 'center'}}>
        //         <Image source={dot_white} style={{width: 10, height: 10, marginRight: 15}}/>
        //         <TouchableOpacity
        //             onPress={() => {
        //                 Keyboard.dismiss();
        //                 navigation.navigate('VideoCall', {type: 'caller', content: 'audioCall'})
        //             }}
        //         >
        //             <Image source={icon_phoneCall} style={{width: 22, height: 22, marginRight: 15}}/>
        //         </TouchableOpacity>
        //         <TouchableOpacity
        //             onPress={() => {
        //                 Keyboard.dismiss();
        //                 navigation.navigate('VideoCall', {type: 'caller', content: 'videoCall'})
        //             }}
        //         >
        //             <Image source={icon_videoCall} style={{width: 25, height: 25, marginRight: 20}}/>
        //         </TouchableOpacity>
        //     </View>
        // ),
        // headerLeft: (
        //     <TouchableOpacity onPress={() => navigation.navigate('AuthenStackNav')}>
        //         <Image source={icon_back} style={{height: 20, width: 20, marginLeft: 15}}/>
        //     </TouchableOpacity>
        // )
    });

    constructor(props) {
        super(props);
        con = this;
        this.state = {
            messages: [],
            loadEarlier: true,
            isLoadingEarlier: false,
            isTyping: false,
            text: null,
            emoji: false,
            gify: false,
            seen: false,
        };
        this.userChat = {
            _id: this.props.user._id,
            name: this.props.user.displayName,
            avatar: this.props.user.avatar,
        };
        this.UserIds = {
            senderId: this.props.user._id,
            receiverId: this.props.user.target.targetId
        };
        this.socket = this.props.socket;
        this.onReceivedMessage = this.onReceivedMessage.bind(this);
        this.onSend = this.onSend.bind(this);
        this.storeMessages = this.storeMessages.bind(this);
        this.onInputTextChanged = this.onInputTextChanged.bind(this);
        this.renderChatFooterCustom = this.renderChatFooterCustom.bind(this);
        this.onLoadEarlier = this.onLoadEarlier.bind(this);
        this.socket.removeListener('ReceiveMessage', this.onReceivedMessage);
        this.socket.removeListener('LoadMessages', this.LoadMessages);
        this.socket.on('ReceiveMessage', this.onReceivedMessage);
        this.socket.on('LoadMessages', this.LoadMessages);
        this._isMounted = false;
        this.messagesPage = 1;
    }

    componentWillMount() {
        this._isMounted = true;
    }

    componentDidMount() {
        this.socket.emit('LoadMessages', {
            messagesPage: this.messagesPage,
            UserIds: this.UserIds,
        });
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            this.setState({emoji: false, gify: false});
        });
        this.socket.on('IsTyping', (isTyping) => {
            if (this._isMounted) {
                this.setState((previousState) => {
                    return {
                        isTyping
                    }
                });
            }
        });
        this.socket.on('LoadMessages', this.LoadMessages.bind(this));
        this.socket.emit('GetSeenStatus', this.UserIds);
        this.socket.on('GetSeenStatus', (seenStatus) => {
            if(seenStatus.lastMesUser === this.props.user._id) {
                this.setState({seen: seenStatus.seen});
            }
            this.socket.removeListener('GetSeenStatus');
        });
        this.socket.on('SeenChat', (seen) => {
            if(this.state.messages !== []) {
                if(this.state.messages[0].user._id === this.props.user._id && seen === true) {
                    this.setState({seen: true});
                }
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.socket.emit('IsTyping', {
            isTyping: false,
            UserIds: this.UserIds,
        });
        con.socket.emit('WatchingChat', {
            watching: false,
            UserIds: con.UserIds,
        });
        Keyboard.dismiss();
        this.setState({gify: false});
        this.setState({emoji: false});
        this.keyboardDidShowListener.remove();
        this.socket.removeListener('IsTyping');
        this.socket.removeListener('WatchingChat');
        this.socket.removeListener('SeenChat');
    }

    LoadMessages(existingMessages) {
        if (existingMessages.success) {
            if (existingMessages.length < 20) {
                this.setState({loadEarlier: false});
            }
            if (this._isMounted === true) {
                this.setState((previousState) => {
                    return {
                        messages: GiftedChat.prepend(previousState.messages, existingMessages.messages),
                        isLoadingEarlier: false,
                    };
                });
            }
        }
    }

    onLoadEarlier() {
        this.setState((previousState) => {
            return {
                isLoadingEarlier: true,
            };
        });
        this.messagesPage++;
        this.socket.emit('LoadMessages', {
            messagesPage: this.messagesPage,
            UserIds: this.UserIds,
        });
    }

    onReceivedMessage(messages) {
        if (this._isMounted === true) {
            this.storeMessages(messages);
            this.setState({seen: false});
        }
    }

    onSend(messages = []) {
        messages.map((mes) => {
            mes.receiveId = this.props.user.target.targetId;
        })
        this.storeMessages(messages, () => {
            this.setState({seen: false});
            this.socket.emit('SendMessage', messages);
        })
        this.setState({text: ''});
    }


    onInputTextChanged(txt) {
        this.setState({text: txt});
        if (txt !== '' && !this.isTypingState) {
            this.isTypingState = true;
            this.socket.emit('IsTyping', {
                isTyping: true,
                UserIds: this.UserIds,
            });
        }
        if (txt === '') {
            this.isTypingState = false;
            this.socket.emit('IsTyping', {
                isTyping: false,
                UserIds: this.UserIds,
            });
        }
    }

    storeMessages(messages, cb) {
        InteractionManager.runAfterInteractions(() => {
            this.setState((previousState) => {
                return {
                    messages: GiftedChat.append(previousState.messages, messages),
                };
            }, cb);
        });

    }

    renderFooter() {
        console.log('isTyping renderFooter', this.state.isTyping);
        return (
            <View>
                {
                    this.state.seen?
                    <Text style={{alignSelf: 'flex-end', marginRight: 50}}>
                        Seen
                    </Text> :
                    null
                }
                {
                    this.state.isTyping?
                    <View style={{flexDirection: 'row', marginBottom: 15}}>
                        <Image
                            style={{
                                marginLeft: 8,
                                justifyContent: 'center', alignItems: 'center',
                                width: 40, height: 40, borderRadius: 20
                            }}
                            source={{uri: this.props.target.avatar}}
                        />
                        <Image source={icon_Typing} style={{height: 40, width: 80}}/>
                    </View> :
                    null
                }
            </View>
        );

    }

    logEmoji(emoji) {
        this.setState({text: this.state.text.concat(emoji)});
    }

    logGify(gify) {
        console.log(gify);
        let msg = {
            image: {
                type: 'require',
                content: gify,
            },
            user: this.userChat,
            createdAt: new Date(),
            _id: uuid.v4(),
        };
        this.onSend([msg]);
    }

    renderCustomActions(props) {
      return (
          <CustomActions
              {...props}
          />
        );
    }

    renderChatFooterCustom(props) {
        const emoji = () => {
            Keyboard.dismiss();
            if (this.state.gify) {
                this.setState({gify: !this.state.gify});
            }
            this.setState({emoji: !this.state.emoji});
        };
        const gify = () => {
            Keyboard.dismiss();
            if (this.state.emoji) {
                this.setState({emoji: !this.state.emoji});
            }
            this.setState({gify: !this.state.gify});
        };
        const sendImages = (images) => {
            images = images.map((message) => {
                return {
                    ...message,
                    user: this.userChat,
                    createdAt: new Date(),
                    _id: uuid.v4(),
                };
            });
            this.onSend(images);
        };
        return (
            <MoreActions
                sendImages={sendImages}
                emoji={emoji}
                gify={gify}
            />
        );
    }

    renderComposer(props){
        return (
            <Composer
                {...props}
                textInputStyle={{borderRadius:8,borderColor:'#d8d8d8',backgroundColor:'#FFFFFF',paddingLeft:10}}
                textInputProps={{
                    onFocus: () => {
                        con.socket.emit('WatchingChat', {
                            watching: true,
                            UserIds: con.UserIds,
                        });
                    },
                    onBlur: () => {
                        con.socket.emit('WatchingChat', {
                            watching: false,
                            UserIds: con.UserIds,
                        });
                    }
                }}

            />
        );
    }

    render() {
        let {navigate} = this.props.navigation;

        let displayemoji = this.state.emoji ?
            <EmojiPicker
                onEmojiSelected={this.logEmoji.bind(this)}
                visible={true}
            />
            : null;

        let displaygify = this.state.gify ?
            <GifyPicker
                onGifySelected={this.logGify.bind(this)}
                visible={true}
            />
            : null;

        return (
            <View style={{flex: 1}}>
                <View style={{
                    flex: 0.1,
                    backgroundColor: '#C13BCE',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <TouchableOpacity onPress={() => navigate(this.props.prevScreenTabNav)}>
                        <Image source={icon_back} style={{height: 20, width: 20, marginLeft: 15}}/>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 5}}>
                        <Image source={dot_white} style={{width: 10, height: 10, marginRight: 15}}/>
                        <TouchableOpacity
                            onPress={() => {
                                Keyboard.dismiss();
                                navigate('CallHandleScreen', {type: 'caller', content: 'audioCall'})
                            }}
                        >
                            <Image source={icon_phoneCall} style={{width: 22, height: 22, marginRight: 15}}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                Keyboard.dismiss();
                                navigate('CallHandleScreen', {type: 'caller', content: 'videoCall'})
                            }}
                        >
                            <Image source={icon_videoCall} style={{width: 25, height: 25, marginRight: 20}}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <GiftedChat
                    text={this.state.text}
                    messages={this.state.messages}
                    onSend={this.onSend}
                    user={this.userChat}
                    loadEarlier={this.state.loadEarlier}
                    onLoadEarlier={this.onLoadEarlier}
                    isLoadingEarlier={this.state.isLoadingEarlier}
                    renderFooter={this.renderFooter.bind(this)}
                    onInputTextChanged={this.onInputTextChanged}
                    renderActions={this.renderCustomActions}
                    renderChatFooter={this.renderChatFooterCustom}
                    keyboardShouldPersistTaps={'never'}
                    showUserAvatar={true}
                    renderComposer={this.renderComposer}
                />
                {displayemoji}
                {displaygify}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.authentication.user,
        target: state.authentication.target,
        socket: state.socket.socket,
        prevScreenTabNav: state.navigation.prevScreenTabNav,
    }
}

export default connect(mapStateToProps, {storeCoupleStatus})(ChatScreen);

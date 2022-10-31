import React, {Component} from 'react';
import {
    StyleSheet, Text, TouchableOpacity, View, Image,
    Modal, DeviceEventEmitter, Dimensions, AppState,
} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import {connect} from 'react-redux';
import {GetLocalStream, logError} from './GetLocalStream';
import {
    RTCPeerConnection, RTCIceCandidate,
    RTCSessionDescription, RTCView,
} from 'react-native-webrtc';

import icon_AcceptCall from '../../../media/icons/receiveCall.png';
import icon_CancelCall from '../../../media/icons/cancelCall.png';
import icon_CancelVideo from '../../../media/icons/videoCallCancel.png';
import icon_SwitchCamera from '../../../media/icons/switchCamera.png';
import full_screen from '../../../media/icons/full-screen-arrows.png';
import collage_screen from '../../../media/icons/icon_collage_screen.png';

import AudioCallingScreen from './AudioCallingScreen';
import VideoCallingScreenSmall from './VideoCallingScreenSmall';
import VideoCallingScreenFull from './VideoCallingScreenFull';

const {width, height} = Dimensions.get('window');

let configuration = {
    "iceServers": [{"url": "stun:stun2.1.google.com:19302"}]
};
let pc;
let con;
let localStream;
class CallHandle extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            localVideo: null,
            remoteVideo: null,
            localId: this.props.user._id,
            remoteId: this.props.user.target.targetId,
            frontCamera: true,
            mute: false,
            isFullScreen: false,
            modalVisible: this.props.navigation.state.params.type !== 'caller',
            modalCallerVisible: this.props.navigation.state.params.type === 'caller',
        };
        con = this;
        con.UserIds = {
            senderId: this.props.user._id,
            receiverId: this.props.user.target.targetId
        };
        con.socket = this.props.socket;
        con.socket.on('data', (data) => {
            switch (data.type) {
                case "offer":
                    con.handleOffer(data.offer);
                    break;
                case "answer":
                    con.handleAnswer(data.answer);
                    break;
                case "candidate":
                    con.handleCandidate(data.candidate);
                    break;
                case "leave":
                    con.handleLeave();
                    break;
                default:
                    break;
            }
        });
        con.accept = null;
        con.isOffer = false;
        if (this.props.navigation.state.params.content === 'videoCall') {
            con.video = true;
        }
        else if (this.props.navigation.state.params.content === 'audioCall') {
            con.video = false;
        }
        InCallManager.setForceSpeakerphoneOn(true);
        InCallManager.start({media: 'audio'});
        DeviceEventEmitter.addListener('WiredHeadset', (data) => {
            if (data.isPlugged) {
                InCallManager.setForceSpeakerphoneOn(false);
            }
            else {
                InCallManager.setForceSpeakerphoneOn(true);
            }
        });
        DeviceEventEmitter.addListener('Proximity', (data) => {
            if (data.isNear) {
                InCallManager.setForceSpeakerphoneOn(false);
            }
            else {
                InCallManager.setForceSpeakerphoneOn(true);
            }
        });
    }

    componentWillMount() {
        con.createPC();
    }

    componentDidMount() {
        if (InCallManager.recordPermission !== 'granted') {
            InCallManager.requestRecordPermission()
                .then((requestedRecordPermissionResult) => {
                    console.log("InCallManager.requestRecordPermission() requestedRecordPermissionResult: ", requestedRecordPermissionResult);
                })
                .catch((err) => {
                    console.log("InCallManager.requestRecordPermission() catch: ", err);
                });
        }

        if (con.props.navigation.state.params.type === 'caller') {
            if (con.video) {
                con.socket.emit('incomingCall', {
                    type: 'videoCall',
                    UserIds: con.UserIds
                });
            }
            else {
                con.socket.emit('incomingCall', {
                    type: 'audioCall',
                    UserIds: con.UserIds
                });
            }
            con.socket.on('incomingAns', (data) => {
                if (data.content === 'accept') {
                    if (!con.isOffer) {
                        con.sendOffer();
                        con.isOffer = true;
                    }
                }
                else if (data.content === 'refuse') {
                    con.props.navigation.goBack();
                }
                con.setState({modalCallerVisible: false});
            });
        }
        else if (con.props.navigation.state.params.type === 'callee') {
            InCallManager.startRingtone('_BUNDLE_');
            setTimeout(() => {
                if (con.accept === null) {
                    con.socket.emit('incomingAns', {
                        UserIds: con.UserIds,
                        content: 'refuse',
                    });
                    InCallManager.stopRingtone();
                    con.props.navigation.goBack();
                }
            }, 20000)
        }
        AppState.addEventListener('change', con.handleAppStateChange);
    }

    handleAppStateChange(nextAppState) {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
            con.handleLeave();
        }
    }

    componentWillUnmount() {
        if (!con.state.frontCamera) {
            localStream.getVideoTracks().forEach(videoTracks => videoTracks._switchCamera());
        }
        con.setState({
            localVideo: null,
            remoteVideo: null,
            localId: null,
            remoteId: null,
        });
        con.UserIds = {
            senderId: null,
            receiverId: null
        };
        pc.close();
        pc.onicecandidate = null;
        pc.onaddstream = null;
        con.accept = null;
        con.isOffer = false;
        InCallManager.stop();
        //------------------------------------------------
        con.socket.removeListener('data');
        con.socket.removeListener('incomingAns');
        AppState.removeEventListener('change', con.handleAppStateChange);
    };

    createPC() {
        console.log('createPC');
        GetLocalStream(true, con.video, (stream) => {
            localStream = stream;
            con.setState({localVideo: stream.toURL()});
            pc = new RTCPeerConnection(configuration);
            pc.addStream(localStream);
            pc.onaddstream = function (e) {
                con.setState({remoteVideo: e.stream.toURL()});
            };
            pc.onicecandidate = function (e) {
                if (e.candidate) {
                    con.socket.emit('data', {
                        type: "candidate",
                        UserIds: con.UserIds,
                        candidate: e.candidate,

                    });
                }
            };
        });
    };

    handleModal(answer) {
        InCallManager.stopRingtone();
        if (answer === 'accept') {
            con.setState({modalVisible: false});
            con.accept = true;
            con.socket.emit('incomingAns', {
                content: 'accept',
                UserIds: con.UserIds
            });
        }
        else {
            con.accept = false;
            con.socket.emit('incomingAns', {
                content: 'refuse',
                UserIds: con.UserIds
            });
            con.props.navigation.goBack();
        }
    }

    handleOffer(offer) {
        pc.setRemoteDescription(new RTCSessionDescription(offer), () => {
            console.log('setRemoteDescription');
        }, logError);
        //create an answer to an offer
        pc.createAnswer((answer) => {
            pc.setLocalDescription(answer, () => {
                console.log('setLocalDescription');
            }, logError);
            con.socket.emit('data', {
                type: "answer",
                answer: answer,
                UserIds: con.UserIds
            });
        }, logError);
    }

    handleAnswer(answer) {
        pc.setRemoteDescription(new RTCSessionDescription(answer), () => {
            console.log('setRemoteDescription');
        }, logError);
    }

    handleCandidate(candidate) {
        pc.addIceCandidate(new RTCIceCandidate(candidate), () => {
            console.log('addIceCandidate');
        }, logError);
    }

    handleLeave() {
        con.socket.emit('data', {
            type: 'leave',
            UserIds: con.UserIds
        });
        con.props.navigation.goBack();
    }

    sendOffer() {
        pc.createOffer(function (offer) {
            con.socket.emit('data', {
                type: "offer",
                UserIds: con.UserIds,
                offer: offer,

            });

            pc.setLocalDescription(offer, () => {
                console.log('setLocalDescription');
            }, logError);
        }, logError);
    }

    // switchCamera() {
    //     con.setState({frontCamera: !con.state.frontCamera});
    //     localStream.getVideoTracks().forEach(videoTracks => videoTracks._switchCamera());
    // }

    mutedSound() {
        let {mute} = con.state;
        con.setState({mute: !con.state.mute});
        localStream.getAudioTracks().forEach(audioTrack => audioTrack.enabled = mute);
    }

    volumeOut() {

    }

    render() {
        const {
            modalWrapper, modalContent, row, videoOptionsFull, localRTCView,
            phoneBtn, imageStyle, videoOptions, VideoView, videoCallView, btnView
        } = styles;
        const {wrapper, RTCViewStyle} = styles;
        const VideoCallJSX = (
            con.state.isFullScreen ?
                <VideoCallingScreenFull
                    RTCView={
                        <View style={VideoView}>
                            <RTCView streamURL={con.state.remoteVideo} style={RTCViewStyle}/>
                            <RTCView streamURL={con.state.localVideo} style={localRTCView}/>
                            <View style={videoOptionsFull}>
                                <TouchableOpacity>
                                    <Image source={icon_SwitchCamera} style={imageStyle}/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.setState({isFullScreen: false})}
                                >
                                    <Image source={collage_screen} style={imageStyle}/>
                                </TouchableOpacity>

                            </View>
                        </View>
                    }
                    muted={con.mutedSound.bind(this)}
                    volumeOut={con.volumeOut.bind(this)}
                    hangup={con.handleLeave.bind(this)}

                />
                : <VideoCallingScreenSmall
                RTCView={
                    <View style={VideoView}>
                        <RTCView streamURL={con.state.remoteVideo} style={RTCViewStyle}/>
                        <View style={videoOptions}>
                            <TouchableOpacity
                            >
                                <Image source={icon_SwitchCamera} style={imageStyle}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.setState({isFullScreen: true})}
                            >
                                <Image source={full_screen} style={imageStyle}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                muted={con.mutedSound.bind(this)}
                volumeOut={con.volumeOut.bind(this)}
                hangup={con.handleLeave.bind(this)}

            />
        );
        const AudioCallJSX = (
            <AudioCallingScreen
                muted={con.mutedSound.bind(this)}
                volumeOut={con.volumeOut.bind(this)}
                hangup={con.handleLeave.bind(this)}
            />
        );

        const mainJSX = con.video === true ? VideoCallJSX : AudioCallJSX;

        return (
            <View style={{flex: 1}}>
                {mainJSX}
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={con.state.modalVisible}
                    onRequestClose={() => {
                        console.log('modal close');
                    }}
                >
                    <View style={modalWrapper}>
                        <View style={modalContent}>
                            <Text style={styles.headerModal}>{con.state.remoteId} is Calling</Text>
                            <View style={styles.buttonsModal}>
                                <TouchableOpacity
                                    onPress={() => con.handleModal('refuse')}
                                >
                                    <Image source={icon_CancelCall} style={phoneBtn}/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => con.handleModal('accept')}
                                >
                                    <Image source={icon_AcceptCall} style={phoneBtn}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={con.state.modalCallerVisible}
                    onRequestClose={() => {
                        console.log('modal close');
                    }}
                >
                    <View style={modalWrapper}>
                        <View style={modalContent}>
                            <Text style={styles.headerModal}>Calling</Text>
                            <View style={row}>
                                <TouchableOpacity
                                    onPress={() => con.handleLeave()}
                                >
                                    <Image source={icon_CancelVideo} style={phoneBtn}/>
                                </TouchableOpacity>
                                <Image source={icon_AcceptCall} style={phoneBtn}/>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    VideoView: {
        flex: 1,
    },
    videoCallView: {
        justifyContent: 'flex-end',
        flex: 8,
        marginHorizontal: 5
    },
    remoteView: {
        flex: 1,
    },
    btnView: {
        flex: 2,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10,
    },
    RTCViewStyle: {
        flex: 1,
    },
    localRTCView: {
        marginTop: 10,
        width: 100,
        height: 100,
        position: 'absolute',
        alignSelf: 'flex-end',
        marginRight: 10
    },
    buttonsModal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: height / 6
    },
    modalWrapper: {
        flex: 1,
        backgroundColor: '#91a9aa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#222222',
        marginHorizontal: 20,
        width: width - 40,
        height: height / 2,
        borderRadius: 10
    },
    headerModal: {
        color: '#fff',
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 20,
    },
    row: {
        flexDirection: 'row',
        marginTop: 40,
        justifyContent: 'space-around',
        paddingHorizontal: 10
    },
    phoneBtn: {
        width: 50,
        height: 50
    },

    imageStyle: {
        width: 25,
        height: 25,
        marginTop: 10
    },
    videoOptions: {
        position: 'absolute',
        alignSelf: 'flex-end',
        marginTop: height * 0.6 - 130,
        paddingRight: 10,
    },
    videoOptionsFull: {
        marginTop: height - 180,
        position: 'absolute',
        alignSelf: 'flex-end',
        paddingRight: 10,
    }

});

function mapStateToProps(state) {
    return {
        user: state.authentication.user,
        target: state.authentication.target,
        socket: state.socket.socket,
    }
}

export default connect(mapStateToProps)(CallHandle);
// export default CallHandle;

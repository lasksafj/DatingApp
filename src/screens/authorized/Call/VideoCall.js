import React, {Component} from 'react';
import {
    StyleSheet, Text, TouchableOpacity, View, Image,
    TextInput, ListView, Platform, Modal, DeviceEventEmitter,
    Dimensions, AppState,
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

const {width, height} = Dimensions.get('window');

let configuration = {
    "iceServers": [{"url": "stun:stun2.1.google.com:19302"}]
};
let pc;
let con;
let localStream;
class VideoCall extends Component {
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
            modalVisible: this.props.navigation.state.params.type !== 'caller',
            modalCallerVisible: this.props.navigation.state.params.type === 'caller',
        };
        this.UserIds = {
            senderId: this.props.user._id,
            receiverId: this.props.user.target.targetId
        };
        con = this;
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
                    UserIds:this.UserIds
                });
            }
            else {
                con.socket.emit('incomingCall', {
                    type: 'audioCall',
                    UserIds:this.UserIds
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
                    con.handleLeave();
                }
                con.setState({modalCallerVisible: false});
            });
        }
        else if (con.props.navigation.state.params.type === 'callee') {
            InCallManager.startRingtone('_BUNDLE_');
            setTimeout(() => {
                if (con.accept === null) {
                    con.socket.emit('incomingAns', {
                        UserIds:this.UserIds,
                        content: 'refuse',
                    });
                    InCallManager.stopRingtone();
                    con.handleLeave();
                }
            }, 10000)
        }
        AppState.addEventListener('change', con.handleAppStateChange);
    }

    handleAppStateChange(nextAppState) {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
            con.socket.emit('data', {
                type: 'leave',
            });
            con.handleLeave();
        }
    }
    //
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
                        candidate: e.candidate,
                        UserIds:this.UserIds
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
                UserIds:this.UserIds
            });
        }
        else {
            con.accept = false;
            con.socket.emit('incomingAns', {
                content: 'refuse',
                UserIds:this.UserIds
            });
            con.handleLeave();
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
                UserIds:this.UserIds,
                answer: answer
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
        con.props.navigation.goBack();
    }

    sendOffer() {
        pc.createOffer(function (offer) {
            con.socket.emit('data', {
                type: "offer",
                UserIds:this.UserIds,
                offer: offer
            });

            pc.setLocalDescription(offer, () => {
                console.log('setLocalDescription');
            }, logError);
        }, logError);
    }

    switchCameraOrSound(change) {
        let frontCamera = con.state.frontCamera;
        let mute = con.state.mute;
        if (change === 'camera') {
            frontCamera = !con.state.frontCamera;
            con.setState({frontCamera});
            localStream.getVideoTracks().forEach(videoTracks => videoTracks._switchCamera());
        }
        else if (change === 'sound') {
            mute = !con.state.mute;
            con.setState({mute});
            localStream.getAudioTracks().forEach(audioTrack => audioTrack.enabled = !mute);
        }
    }

    render() {
        const {wrapper, modalWrapper, modalContent, row, phoneBtn, btnView, videoCallView} = styles;

        let displaySound = con.state.mute ? 'Mute Off' : 'Mute On';
        return (
            <View style={wrapper}>
                <View style={videoCallView}>
                    <RTCView streamURL={con.state.remoteVideo} style={styles.remoteView}/>
                    <RTCView streamURL={con.state.localVideo} style={styles.selfView}/>
                </View>
                <View style={btnView}>
                    <TouchableOpacity
                        style={{marginLeft: 10}}
                        onPress={() => con.switchCameraOrSound('camera')}
                    >
                        <Image source={icon_SwitchCamera} style={{width: 25, height: 25}}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            con.socket.emit('data', {
                                type: 'leave',
                                UserIds:this.UserIds
                            });
                            con.handleLeave();
                        }}
                    >
                        <Image source={icon_CancelVideo} style={{width: 40, height: 40}}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{backgroundColor: 'green', margin: 5}}
                        onPress={() => con.switchCameraOrSound('sound')}
                    >
                        <Text style={{padding: 5}}>{displaySound}</Text>
                    </TouchableOpacity>
                </View>
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
                                    onPress={() => {
                                        con.socket.emit('data', {
                                            type: 'leave',
                                            UserIds:this.UserIds
                                        });
                                        con.handleLeave();
                                    }}
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
    wrapper: {
        flex: 1,
        backgroundColor: '#2D2E29',
        alignItems: 'stretch'
    },
    selfView: {
        alignSelf: 'flex-end',
        width: 100,
        height: 100,
        position: 'absolute',
    },
    videoCallView: {
        justifyContent: 'flex-end',
        flex: 8,
        backgroundColor: 'gray',
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
    phoneBtn: {
        width: 50,
        height: 50
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
    }
});

function mapStateToProps(state) {
    return {
        user: state.authentication.user,
        target: state.authentication.target,
        socket: state.socket.socket,
    }
}

export default connect(mapStateToProps)(VideoCall);
// export default VideoCall;


/*
 <TouchableOpacity
 style={{backgroundColor: 'green', margin: 5}}
 onPress={() => {
 con.changeQuality('low')
 }}
 >
 <Text style={{padding: 5}}>Low Quality</Text>
 </TouchableOpacity>
 <TouchableOpacity
 style={{backgroundColor: 'green', margin: 5}}
 onPress={() => {
 con.changeQuality('high')
 }}
 >
 <Text style={{padding: 5}}>High Quality</Text>
 </TouchableOpacity>
 changeQuality(qual) {
 con.setState({qual: qual});
 GetLocalStream(con.state.frontCamera, qual, (stream) => {
 if (localStream) {
 pc.removeStream(localStream);
 localStream.release();
 }
 localStream = stream;
 con.setState({localVideo: stream.toURL()});
 pc.addStream(stream);
 con.sendOffer();
 });
 }
 */

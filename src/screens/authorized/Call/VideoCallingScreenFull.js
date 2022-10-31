/**
 * Created by minhphan on 8/17/2017.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import avatar from '../../../media/temp/avatar1.jpg';
import icon_muted from '../../../media/icons/icon_muted.png';
import icon_mic from '../../../media/icons/icon_microphone.png';
import icon_volume_mute from '../../../media/icons/icon_volume_muted.png';
import icon_volume from '../../../media/icons/icon_volume.png';
import icon_hangUp from '../../../media/icons/icon_phone.png';
import {callingStyles, VideoCallingStyle} from '../../../styles/CallSreenStyle';
import icon_CancelVideo from '../../../media/icons/videoCallCancel.png';
import icon_SwitchCamera from '../../../media/icons/switchCamera.png';

let {width, height} = Dimensions.get('window');

class VideoCallScreenFull extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isMuted: false,
            isVolumeOut: true
        }
    }

    render() {
        const {wrapper, row, text, btnHangup, videoCallView, btn, footer} = styles;
        const {isVolumeOut, isMuted} = this.state;
        return (
            <View style={wrapper}>
                <View style={videoCallView}>
                    {this.props.RTCView}
                </View>
                <View style={footer}>
                    <TouchableOpacity
                        style={btn}
                        onPress={() => {
                            this.setState({isMuted: !this.state.isMuted});
                            this.props.muted()
                        }}
                    >
                        <Image
                            source={isMuted ? icon_muted : icon_mic}
                            style={{width: 30, height: 30}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={btnHangup}
                        onPress={() => this.props.hangup()}
                    >
                        <Image source={icon_hangUp} style={{width: 40, height: 40}}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={btn}
                        onPress={() => {
                            this.setState({isVolumeOut: !this.state.isVolumeOut});
                            this.props.volumeOut()
                        }}
                    >
                        <Image
                            source={isVolumeOut ? icon_volume : icon_volume_mute}
                            style={{width: 30, height: 30}}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

VideoCallScreenFull.defaultProps = {
    muted: () => {
    },
    volumeOut: () => {
    },
    hangup: () => {
    },
};

VideoCallScreenFull.propTypes = {
    RTCView: PropTypes.element,
    muted: PropTypes.func,
    volumeOut: PropTypes.func,
    hangup: PropTypes.func,
};


const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    videoCallView: {
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        position: 'absolute',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: width
    },
    btn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#222222',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnHangup: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FA4C4D',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default VideoCallScreenFull;

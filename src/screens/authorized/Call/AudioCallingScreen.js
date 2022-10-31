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
import {callingStyles} from '../../../styles/CallSreenStyle';


class AudioCallingScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isMuted: false,
            isVolumeOut: true
        }
    }

    render() {
        const {wrapper, header, container, rowBtn, imageStyle, name, btn, btnHangup, text} = callingStyles;
        const {isMuted, isVolumeOut} = this.state;
        return (
            <View style={wrapper}>
                <View style={header}>
                    <Image source={avatar} style={imageStyle}/>
                    <Text style={name}>Name</Text>
                </View>
                <View style={container}>
                    <View>
                        <Text style={text}>Calling</Text>
                        <Text style={text}>TIme</Text>
                    </View>
                    <View style={rowBtn}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({isMuted: !this.state.isMuted});
                                this.props.muted();
                            }}
                            style={btn}
                        >
                            <Image
                                source={isMuted ? icon_muted : icon_mic}
                                style={{width: 30, height: 30}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({isVolumeOut: !this.state.isVolumeOut});
                                this.props.volumeOut();
                            }}
                            style={btn}
                        >
                            <Image
                                source={isVolumeOut ? icon_volume : icon_volume_mute}
                                style={{width: 30, height: 30}}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.hangup();
                        }}
                        style={btnHangup}
                    >
                        <Image source={icon_hangUp} style={{width: 30, height: 30}}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

AudioCallingScreen.defaultProps = {
    muted: (muted) => {
    },
    volumeOut: () => {
    },
    hangup: () => {
    },
};

AudioCallingScreen.propTypes = {
    muted: PropTypes.func,
    volumeOut: PropTypes.func,
    hangup: PropTypes.func,
};

export default AudioCallingScreen;

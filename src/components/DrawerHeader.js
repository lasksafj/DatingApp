import React, {Component} from 'react';
import {View, Text, Image, StyleSheet} from'react-native';
import {connect} from 'react-redux';

class DrawerHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let {avatar, displayName} = this.props.user;
        let {wrapper, imageStyle, nameStyle} = styles;
        return (
            <View style={wrapper}>
                <Image source={{uri: avatar}} style={imageStyle}/>
                <Text style={nameStyle}>{displayName}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#7E007E',
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageStyle: {
        width: 70,
        height: 70,
        borderRadius: 35
    },
    nameStyle: {
        color: '#fff',
        marginTop: 10
    }
});

export default connect(state => ({
    user: state.authentication.user,
}))(DrawerHeader);

/**
 * Created by minhphan on 7/24/2017.
 */
import React, {Component} from 'react';
import {
    View, Text, Image, TouchableOpacity,
    Dimensions, StyleSheet
} from 'react-native';
import icon_menu from '../media/icons/ic_menu.png';

const {width, height} = Dimensions.get('window');
const iconSize = height / 13 * 0.6;

class Header extends Component {
    render() {
        const {wrapper, imageStyle, title} = styles;

        return (
            <View style={wrapper}>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('DrawerOpen')}
                >
                    <Image source={icon_menu} style={imageStyle}/>
                </TouchableOpacity>
                <Text style={title}>My Love</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#7E007E',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#AFEAF2'
    },
    imageStyle: {
        width: iconSize,
        height: iconSize,
        marginLeft: iconSize / 3
    },
    title: {
        fontSize: 20,
        color: '#fff',
        marginLeft: width / 3,
        fontWeight: 'bold'
    }
});

export default Header;
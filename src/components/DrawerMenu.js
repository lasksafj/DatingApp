/**
 * Created by minhphan on 7/24/2017.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from'react-native';
import DrawerHeader from "./DrawerHeader";
import {connect} from 'react-redux';
import {logout} from '../actions/Authen';


class DrawerMenu extends Component {

    render() {

        const {wrapper, header, container, btn} = styles;

        return (
            <View style={wrapper}>
                <View style={header}>
                    <DrawerHeader/>
                </View>
                <View style={container}>
                    <TouchableOpacity
                        style={btn}
                        onPress={() => this.props.navigation.navigate('BackGroundSettingView')}
                    >
                        <Text>Background Setting</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={btn}
                    >
                        <Text>Time setting</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={btn}
                        onPress={() => this.props.navigation.navigate('EditProfileScreen')}
                    >
                        <Text>Setting Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={btn}
                        onPress={() => this.props.logout()}
                    >
                        <Text>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    header: {
        flex: 3,
    },
    container: {
        flex: 7,
        paddingTop: 20,
        paddingHorizontal: 10,
        backgroundColor: '#F1F1F1'
    },
    btn: {
        marginTop: 20
    }


});

export default connect(null, {logout})(DrawerMenu);
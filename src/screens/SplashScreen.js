import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import getTargetOfUser from '../api/authen/GetTargetOfUser';
import checkLogin from '../api/authen/CheckLogin';
import AsyncStorageAccess from '../api/AsyncStorageAccess';
import {connect} from 'react-redux';
import {loginSuccess} from '../actions/Authen';
import {AccessSocket} from '../actions/Socket';
import add_friend from '../media/temp/add_friend.png';
import config from '../config/config';
import io from 'react-native-socket.io-client';

class SplashScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        AsyncStorageAccess.getFromStorage('@loginToken')
            .then(token => {
                console.log('token', token);
                if (token === '') {
                    this.props.navigation.navigate('UnauthenStackNav');
                } else {
                    checkLogin(token)
                        .then(res => {
                            console.log('result', res);
                            if (res.success === false) {
                                this.props.navigation.navigate('UnauthenStackNav')
                            } else {
                                const socket = io(config.host_domain, {jsonp: false});
                                socket.on('connect', () => {
                                    console.log('connected!');
                                    this.props.AccessSocket(socket);

                                    if (res.user.target.targetId === null || res.user.target.status === 'pending') {
                                        this.props.loginSuccess(res.user, res.token, res.user.target);
                                    } else {
                                        getTargetOfUser(res.token)
                                            .then(target => {
                                                console.log('target', target);
                                                if (target) {
                                                    this.props.loginSuccess(res.user, res.token, target.target);
                                                }
                                            })
                                    }
                                });

                            }
                        })
                        .catch(err => {
                            this.props.navigation.navigate('UnauthenStackNav');
                        })
                }
            });
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Text>Chao mung cac ban</Text>
            </View>
        );
    }
}

export default connect(null, {loginSuccess, AccessSocket})(SplashScreen);

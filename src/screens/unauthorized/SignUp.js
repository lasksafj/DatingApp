/**
 * Created by minhphan on 6/29/2017.
 */
import React, {Component} from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image
} from 'react-native';
import {connect} from 'react-redux';
import {loginSuccess} from '../../actions/Authen';
import {AccessSocket} from '../../actions/Socket';
import Styles from '../../styles/sign';
import config from '../../config/config';
import io from 'react-native-socket.io-client';


import RegisterAPI from '../../api/authen/RegisterApi';
import LoginAPI from '../../api/authen/LoginAPI';
import requestOtpCode from '../../api/authen/RequestOtpCode';
import getTargetOfUser from '../../api/authen/GetTargetOfUser';
import validatePhoneNumber from '../../api/validation/ValidatePhoneNumber';
import fbIcon from '../../media/icons/facebook_icon.png';
import ggIcon from '../../media/icons/gg_icon.png';
import background from '../../media/temp/login_background_2.jpg';

class SignUp extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            phone_number: '',
            password: '',
            lastName: '',
            firstName: '',
            validInput: true,
        };
    }

    LoginFBHandle() {
        LoginAPI.loginWithFacebook((err, res) => {
            console.log('login face');
            if (res.success === false) {
                return this.onFailed(res.message);
            } else {
                console.log('login face success');
                const socket = io(config.host_domain, {jsonp: false});
                socket.on('connect', () => {
                    console.log('connected!');
                    this.props.AccessSocket(socket);
                    if (res.user.target.targetId === null || res.user.target.status === 'pending') {
                        this.props.loginSuccess(res.user, res.token, res.user.target);
                    } else {
                        getTargetOfUser(res.token)
                            .then(target => {
                                console.log(target, target);
                                if (target) {
                                    this.props.loginSuccess(res.user, res.token, target.target);
                                }
                            })
                    }
                });
            }
        })
    };

    LoginGGHandle() {
        LoginAPI.loginWithGoogle((err, res) => {
            if (res.success === false) {
                return this.onFailed(res.message);
            } else {
                console.log('login google success');
                const socket = io(config.host_domain, {jsonp: false});
                socket.on('connect', () => {
                    console.log('connected!');
                    this.props.AccessSocket(socket);
                    if (res.user.target.targetId === null || res.user.target.status === 'pending') {
                        this.props.loginSuccess(res.user, res.token, res.user.target);
                    } else {
                        getTargetOfUser(res.token)
                            .then(target => {
                                console.log(target, target);
                                if (target) {
                                    this.props.loginSuccess(res.user, res.token, target.target);
                                }
                            })
                    }
                });
            }
        })
    };

    onSuccess() {
        let {navigate} = this.props.navigation;
        navigate('Authorized');
    }

    // onSuccessRegister(request_id) {
    //     let {navigate} = this.props.navigation;
    //     navigate('VerifyUserScreen', {request_id: request_id});
    // }
    onSuccessRegister() {
        let {navigate} = this.props.navigation;
        navigate('SignInScreen')
    };


    removeEmail() {
        this.setState({phone_number: '', password: ''});
    }

    onFailed(message) {
        Alert.alert(
            'Sorry',
            message,
            [
                {text: 'OK', onPress: () => this.removeEmail.bind(this)}
            ],
            {cancelable: false}
        );
    }

    RegisterHandle() {
        let {phone_number, password, lastName, firstName} = this.state;
        RegisterAPI(phone_number, password, firstName, lastName)
            .then(res => {
                console.log('phone_number register', phone_number);
                if (res.success === false) {
                    return this.onFailed(res.message);
                } else {
                    this.props.loginSuccess(res.user, res.token, res.user.targetId);
                    ///this.onSuccessRegister();
                    // requestOtpCode(res.phone_number)
                    //     .then(res => {
                    //         if (res.success === true) {
                    //             return this.onSuccessRegister(res.request_id);
                    //         } else {
                    //             return this.onFailed("Cannot send otp code");
                    //         }
                    //     })
                }
            })
            .catch(err => console.log(err));
    }
    ;


    render() {
        const {phone_number, password, firstName, lastName} = this.state;
        const {
            wrapper, container, textInputBox, button,
            footer, text, signInFBBtn, signInGGBtn, imageStyle,
            backgroundImage, status, title, nameInputBox
        } = Styles.SigInStyle;

        return (
            <View style={wrapper}>
                <Image source={background} style={backgroundImage}>
                    <View style={status}>
                        <Text style={title}>Chia sẽ giây phút yêu thương</Text>
                    </View>
                    <View style={container}>
                        <View style={{flexDirection: 'row'}}>
                            <TextInput
                                style={nameInputBox}
                                placeholder='Họ'
                                placeholderTextColor='gray'
                                onChangeText={text => this.setState({firstName: text})}
                                value={firstName}
                                underlineColorAndroid='transparent'
                            />
                            <TextInput
                                style={nameInputBox}
                                placeholder='Tên'
                                placeholderTextColor='gray'
                                onChangeText={text => this.setState({lastName: text})}
                                value={lastName}
                                underlineColorAndroid='transparent'
                            />
                        </View>

                        <TextInput
                            style={textInputBox}
                            placeholder='Nhập số điện thoại của bạn'
                            placeholderTextColor='gray'
                            onChangeText={text => this.setState({phone_number: text})}
                            onBlur={() => {
                                if (!validatePhoneNumber(phone_number)) {
                                    alert("You have entered an invalid email address!");
                                }
                            }}
                            value={phone_number}
                            underlineColorAndroid='transparent'
                            onEndEditing={() => this.refs.pass.focus()}
                        />
                        <TextInput
                            ref='pass'
                            style={textInputBox}
                            placeholder='Nhập mật khẩu'
                            placeholderTextColor='gray'
                            onChangeText={text => this.setState({password: text})}
                            value={password}
                            underlineColorAndroid='transparent'
                            secureTextEntry
                        />
                        <TouchableOpacity style={button} onPress={this.RegisterHandle.bind(this)}>
                            <Text style={{color: '#fff'}}>Tạo tài khoản</Text>
                        </TouchableOpacity>
                        <Text style={text}> Hoặc </Text>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                style={signInFBBtn}
                                onPress={this.LoginFBHandle.bind(this)}
                            >
                                <Image source={fbIcon} style={imageStyle}/>
                                <Text style={text}>Facebook</Text>
                                <Text/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={signInGGBtn}
                                onPress={this.LoginGGHandle.bind(this)}
                            >
                                <Image source={ggIcon} style={imageStyle}/>
                                <Text style={text}>Google</Text>
                                <Text/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={footer}>
                        <Text style={text} onPress={() => this.props.navigation.navigate('SignInScreen')}>Đăng
                            nhập</Text>
                    </View>
                </Image>
            </View>
        );
    }
}


export default connect(null, {loginSuccess, AccessSocket})(SignUp);

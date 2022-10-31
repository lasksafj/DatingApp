/**
 * Created by minhphan on 6/28/2017.
 */
import React, {Component} from 'react';
import {
    View, Text, TouchableOpacity,
    TextInput, StyleSheet, Dimensions,
    Alert, Image
} from 'react-native';
import {connect} from 'react-redux';
import {loginSuccess} from '../../actions/Authen';
import {AccessSocket} from '../../actions/Socket';
import LoginAPI from '../../api/authen/LoginAPI';
import getTargetOfUser from '../../api/authen/GetTargetOfUser';
import validatePhoneNumber from '../../api/validation/ValidatePhoneNumber';
import background from '../../media/temp/login_background_2.jpg';
import config from '../../config/config';
import io from 'react-native-socket.io-client';

const {width, height} = Dimensions.get('window');

class SignIn extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            phone_number: '',
            password: ''
        }
    }

    onFailed(message) {
        Alert.alert(
            'Sorry',
            message,
            [
                {text: 'OK', onPress: () => this.removePhoneNumber.bind(this)}
            ],
            {cancelable: false}
        );
    }

    removePhoneNumber() {
        this.setState({
            phone_number: '',
            password: ''
        })
    }

    LoginLocalHandle() {
        let {phone_number, password} = this.state;
        LoginAPI.loginLocal(phone_number, password)
            .then(res => {
                if (res.success === false) {
                    return this.onFailed(res.message);
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
                                    console.log(target, target);
                                    if (target) {
                                        this.props.loginSuccess(res.user, res.token, target.target);
                                    }
                                })
                        }
                    });
                }
            })
            .catch(err => console.log(err));
    };

    ForgetPassHandle() {
        let {navigate} = this.props.navigation;
        navigate('ForgetPassword');
    }

    render() {

        const {phone_number, password} = this.state;
        const {wrapper, container, inputTextBox, signInBtn, text, footer, backgroundImage} = styles;

        return (

            <Image source={background} style={backgroundImage}>
                <View style={wrapper}>
                    <Text style={{color: '#fff', fontSize: 20, marginBottom: 5}}>Xin chào!</Text>
                    <Text style={{color: '#fff', marginBottom: 20}}>Kết nối hạnh phúc, chia sẽ yêu thương</Text>
                    <TextInput
                        style={inputTextBox}
                        underlineColorAndroid='transparent'
                        placeholder="Số điện thoại"
                        placeholderTextColor='gray'
                        onBlur={() => {
                            if (!validatePhoneNumber(phone_number)) {
                                alert("You have entered an invalid email address!");
                            }
                        }}
                        value={phone_number}
                        onChangeText={text => this.setState({phone_number: text})}
                    />
                    <TextInput
                        style={inputTextBox}
                        underlineColorAndroid='transparent'
                        placeholder="Mật khẩu"
                        placeholderTextColor='gray'
                        value={password}
                        onChangeText={text => this.setState({password: text})}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        style={signInBtn}
                        onPress={this.LoginLocalHandle.bind(this)}
                    >
                        <Text style={text}>Đăng nhập</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', width: width / 3 * 2, justifyContent: 'space-between'}}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('SignUpScreen')}
                        >
                            <Text style={text}>Đăng ký</Text>
                            <Text/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.ForgetPassHandle.bind(this)}
                        >
                            <Text style={text}>Quên mật khẩu ?</Text>
                            <Text/>
                        </TouchableOpacity>
                    </View>
                </View>
            </Image>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backgroundImage: {
        width: width,
        height: height,
    },
    inputTextBox: {
        height: 40,
        width: width * 2 / 3,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginVertical: 5,
        paddingHorizontal: 15,
        paddingTop: 10,
        alignItems: 'center',
        opacity: 0.8,
        color: '#000'
    },
    signInBtn: {
        height: 40,
        width: width * 2 / 3,
        borderRadius: 5,
        backgroundColor: '#8400C3',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    text: {
        color: '#fff'
    },
    imageStyle: {
        width: 30,
        height: 30
    },

});

export default connect(null, {loginSuccess, AccessSocket})(SignIn);

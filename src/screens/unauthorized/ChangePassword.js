import React, {Component} from 'react';
import {
    View, Text, TextInput,
    TouchableOpacity, StyleSheet, Dimensions
} from 'react-native';
import validatePassword from'../../api/validation/ValidatePassword';

const valid_pass = "A password between 6 to 20 characters which contain at least one numeric digit, one uppercase, and one lowercase letter";
const valid_re_pass = "valid re_password";
const invalid_re_pass = "invalid re_password";
const {width, height} = Dimensions.get('window');

class ChangePassword extends Component {

    static navigationOptions = {
        title: 'Change password',
        headerStyle: {
            backgroundColor: '#7E007E',
        },
        headerTitleStyle: {
            color: '#fff',
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            re_password: '',
            isPasswordValid: false,
            isRePasswordValid: false,
            isFocusPass: false,
            isFocusRePass: false,
        }
    }

    render() {

        const {password, isPasswordValid, isRePasswordValid, isFocusPass, isFocusRePass} = this.state;
        const {wrapper, container, inputTextBox, button, text, infopass, infotext} = styles;
        return (
            <View style={wrapper}>
                <View style={container}>
                    <Text>Nhập mật khẩu mới</Text>
                    <TextInput
                        style={inputTextBox}
                        underlineColorAndroid={'transparent'}
                        placeholder="Nhập mật khẩu của bạn!"
                        onChangeText={text => {
                            console.log(text);
                            if (validatePassword(text)) {
                                this.setState({isPasswordValid: true});
                                this.setState({password: text})

                            } else {
                                this.setState({isPasswordValid: false})
                            }
                        }}
                        onFocus={() => {
                            this.setState({isFocusPass: true})
                        }}
                        secureTextEntry
                    />
                    <View style={infopass}>
                        {isFocusPass ? <Text style={infotext}>{(isPasswordValid) ? '  ' : valid_pass}</Text> :
                            <Text> </Text>}
                    </View>
                    <TextInput
                        style={inputTextBox}
                        underlineColorAndroid={'transparent'}
                        placeholder="Xác nhận mật khẩu"
                        onChangeText={text => {
                            console.log('password', password);
                            console.log('re_pass', text);
                            if (password !== text) {
                                console.log('khac');
                                this.setState({isRePasswordValid: false})
                            } else {
                                this.setState({isRePasswordValid: true});
                                this.setState({re_password: text})
                            }
                        }}
                        onFocus={() => {
                            this.setState({isFocusRePass: true})
                        }}
                        secureTextEntry
                    />
                    <View style={infopass}>
                        {isFocusRePass ?
                            <Text style={infotext}>{isRePasswordValid ? valid_re_pass : invalid_re_pass}</Text> :
                            <Text> </Text>}
                    </View>

                    <TouchableOpacity
                        style={button}
                    >
                        <Text style={text}>Lưu</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        marginTop: height / 6,
        alignItems: 'center',
        // height: height / 2,
    },
    inputTextBox: {
        marginTop: 10,
        width: width / 3 * 2,
        backgroundColor: '#CECECE',
        borderRadius: 5,
        justifyContent: 'center'
    },
    infopass: {
        width: width / 3 * 2,
    },
    button: {
        marginTop: 20,
        width: width / 3 * 2,
        backgroundColor: '#7E007E',
        alignItems: 'center',
        paddingVertical: 5,
        borderRadius: 5,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18
    },
    infotext: {
        fontSize: 12
    }
});


export default ChangePassword;

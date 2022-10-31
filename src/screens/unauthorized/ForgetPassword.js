import React, {Component} from 'react';
import {
    View, Text, TextInput,
    TouchableOpacity, StyleSheet, Dimensions
} from 'react-native';
import forgetPassword from '../../api/authen/ForgetPassword';


const {width, height} = Dimensions.get('window');

class ForgetPassword extends Component {

    static navigationOptions = {
        title: 'Quên mật khẩu',
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
            phone_number: ''
        }
    }

    sendPhone(phone_number) {
        let {navigate} = this.props.navigation;
        navigate('ChangePassWord');
        // forgetPassword(phone_number)
        //     .then(res => {
        //         if (res.success === false) {
        //             // nhap lai so dt
        //         } else {
        //             //go to man hinh nhap code
        //         }
        //     })

    }

    render() {

        const {phone_number} = this.state;
        const {wrapper, container, inputTextBox, button, text} = styles;
        return (
            <View style={wrapper}>
                <View style={container}>
                    <Text>Nhập số điện thoại của bạn!</Text>
                    <TextInput
                        style={inputTextBox}
                        underlineColorAndroid={'transparent'}
                        placeholder="Nhập số điện thoại của bạn!"
                        value={phone_number}
                        onChangeText={text => this.setState({phone_number: text})}
                    />
                    <TouchableOpacity
                        style={button}
                        onPress={this.sendPhone.bind(this)}
                    >
                        <Text style={text}>Gửi</Text>
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
        marginTop: 20,
        width: width / 3 * 2,
        backgroundColor: '#CECECE',
        borderRadius: 5,
        justifyContent: 'center'
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
    }
});

export default ForgetPassword;

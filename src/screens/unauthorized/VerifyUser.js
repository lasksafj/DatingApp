/**
 * Created by minhphan on 6/29/2017.
 */
/**
 * Created by minhphan on 6/28/2017.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions} from 'react-native';
import verifySMS from '../../api/authen/VerifySMS';
// import saveToken from '../../api/saveToken';

const {width, height} = Dimensions.get('window');


class VerifyUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
        }
    }

    verifyCodeHandle() {
        const {code} = this.state;
        const {request_id} = this.props.navigation.state.params;
        verifySMS(request_id, code)
            .then(res => {
                console.log(res.success);
            })
            .catch(err => console.log(err));
    }

    goEditProfile() {
        this.props.navigation.navigate('EditProfileScreen');
    }

    render() {

        const {code} = this.state;
        const {wrapper, inputTextBox, signInButton, text} = styles;
        const {request_id} = this.props.navigation.state.params;

        return (
            <View style={wrapper}>

                <Text style={{color: '#fff', fontSize: 20, marginBottom: 5}}>Nhập mã từ sms</Text>
                <Text style={{color: '#fff', marginBottom: 20}}>Kiểm tra sms để lấy mã kích hoạt tài
                    khoản</Text>
                <TextInput
                    style={inputTextBox}
                    underlineColorAndroid={'#fff'}
                    placeholder="Verify code"
                    value={code}
                    onChangeText={text => this.setState({code: text})}
                />
                <Text>{request_id}</Text>
                <TouchableOpacity style={signInButton} onPress={this.goEditProfile.bind(this)}>
                    <Text style={text}>Tiếp tục</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#2795D2',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputTextBox: {
        height: 40,
        width: width * 2 / 3,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginVertical: 10,
    },
    signInButton: {
        height: 40,
        width: width * 2 / 3,
        borderRadius: 5,
        backgroundColor: '#01C853',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: '#fff'
    },
});

export default VerifyUser;

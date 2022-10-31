/**
 * Created by minhphan on 7/14/2017.
 */
import React, {Component} from 'react';
import {
    View, Text, TextInput, Dimensions,
    TouchableOpacity, Image, StyleSheet,
    ScrollView, ActivityIndicator, Alert
}from 'react-native';
import {storeUser} from '../../../actions/Authen';
import ModalDropdown from 'react-native-modal-dropdown';

import AsyncStorageAccess from '../../../api/AsyncStorageAccess';
import uploadAvatar from '../../../api/profile/UpdateAvatar';
import uploadProfile from '../../../api/profile/UpdateProfile';
import disableCouple from'../../../api/profile/DisableCouple';
import restoreCouple from '../../../api/profile/RestoreCouple';

import addAvatar from '../../../media/icons/adduser.png';
import icon_male from '../../../media/icons/icon_male.png';
import icon_female from '../../../media/icons/icon_female.png';
import icon_male_active from '../../../media/icons/icon_male_blue.png';
import icon_female_active from '../../../media/icons/icon_female_blue.png';

import icon_camera from '../../../media/icons/icon_camera_white.png';

import {connect} from 'react-redux';
import ImagePicker from 'react-native-image-picker';

const options = {
    title: 'Select Avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

const days = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
];
const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

const monthDigits = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const years = ['1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999'];


const {width} = Dimensions.get('window');

class EditProfile extends Component {

    static navigationOptions = {
        title: 'Edit Profile',
        headerStyle: {
            backgroundColor: '#A721B3',
        },
        headerTitleStyle: {
            color: '#fff',
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            avatarSource: '',
            avatar: '',
            gender: '',
            birthday: '',
            lastName: '',
            displayName: '',
            firstName: '',
            email: '',
            day: '',
            month: '',
            year: '',
            isUploadAvatar: false,
            isMaleActive: false,
            isFemaleActive: false,
        };
        this.RNBlobUpload = this.RNBlobUpload.bind(this);
    }

    componentDidMount() {
        let {user} = this.props;
        console.log('user', user);
        if (user !== null) {
            this.showProfile(user);
        }
    }

    showProfile(user) {
        if (user.birthday !== '') {
            let birth = user.birthday.split('/');
            this.setState({
                day: birth[0],
                month: birth[1],
                year: birth[2]
            });
        }
        this.setState({
            displayName: user.displayName,
            lastName: user.lastName,
            firstName: user.firstName,
            email: user.email,
            gender: user.gender,
            avatar: user.avatar,
        });
        this.isGenderActive(user.gender)
    }

    uploadAvatarHandle() {
        this.setState({isUploadAvatar: true});
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                this.setState({isUploadAvatar: false});
            }
            else if (response.error) {
                this.setState({isUploadAvatar: false});
            }
            else {
                this.RNBlobUpload(response.data);
            }
        });
    };

    RNBlobUpload(data) {
        if (data !== null) {
            AsyncStorageAccess.getFromStorage('@loginToken')
                .then(token => {
                    uploadAvatar(token, data)
                        .then(data => {
                            if (data.avatar !== undefined) {
                                this.setState({avatar: data.avatar, isUploadAvatar: false})
                            }
                        });
                });
        }
    }

    isGenderActive(gender) {
        if (gender === 'male') {
            this.setState({isMaleActive: true, isFemaleActive: false})
        } else if (gender === 'female') {
            this.setState({isFemaleActive: true, isMaleActive: false})
        } else {
            this.setState({isFemaleActive: false, isMaleActive: false})
        }
    }

    updateProfileHandle() {
        let {day, month, year} = this.state;
        let birthday = day + '/' + month + '/' + year;
        let {lastName, firstName, gender, email} = this.state;
        AsyncStorageAccess.getFromStorage('@loginToken')
            .then(token => {
                uploadProfile(token, lastName, firstName, birthday, gender, email)
                    .then(res => {
                        if (res.user) {
                            this.showProfile(res.user);
                            this.props.storeUser(res.user);
                        }
                    });
            });
    }

    setMaleGender() {
        this.setState({gender: 'male', isMaleActive: true, isFemaleActive: false})
    }

    setFemaleGender() {
        this.setState({gender: 'female', isMaleActive: false, isFemaleActive: true})
    }

    disableCoupleAlert() {
        Alert.alert(
            'Vô hiệu hóa cặp đôi',
            'Khi vô hiệu hóa, bạn sẽ không nhìn thấy tin nhắn, kỹ niệm của bạn và người ấy',
            [
                {text: 'OK', onPress: () => this.disableCoupleHandle()},
                {
                    text: 'Hủy ', onPress: () => {
                }
                }
            ],
            {cancelable: true}
        );
    }

    disableCoupleHandle() {
        console.log('disableCoupleHandle');
        AsyncStorageAccess.getFromStorage('@loginToken')
            .then(token => {
                disableCouple(token)
                    .then(res => {
                        if (res.success === true) {
                            this.props.navigation.navigate('TabNav');
                        }
                    });
            });
    }

    deleteCoupleAlert() {
        Alert.alert(
            'Xóa đối tượng',
            'Khi xóa cặp đôi, hệ thông sẽ loại bỏ thông tin về cặp đôi cảu bạn',
            [
                {text: 'OK', onPress: () => this.deleteCoupleHandle.bind(this)},
                {
                    text: 'Hủy ', onPress: () => {
                }
                }
            ],
            {cancelable: true}
        );
    }

    deleteCoupleHandle() {

    }

    restoreCouple() {
        AsyncStorageAccess.getFromStorage('@loginToken')
            .then(token => {
                restoreCouple(token)
                    .then(res => {
                        if (res.success === true) {
                            this.props.navigation.navigate('TabNav');
                        }
                    });
            });
    }


    render() {
        const {
            wrapper, header, container, avatarStyle, text, genderIcon,
            row, textInput, ModalDropdownStyle, btn, genderBtn, name, saveBtn, targetSetting
        } = styles;
        const {avatar, lastName, firstName, email, day, month, year, displayName} = this.state;
        const {target} = this.props;

        const targetOptionsView = (
            this.props.couple.isBlocked !== 'isBlocked'
                ? (
                <View style={{
                    flexDirection: 'row',
                    marginBottom: 10,
                    marginLeft: width / 3,
                    alignItems: 'center'
                }}>
                    <TouchableOpacity
                        onPress={() => this.disableCoupleAlert()}
                    >
                        <Text style={{
                            color: '#0350AA',
                            textDecorationLine: 'underline',
                            marginRight: 10,
                        }}> Vô hiệu hóa
                            ?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.deleteCoupleAlert()}
                    >
                        <Text style={{color: '#0350AA', textDecorationLine: 'underline'}}> Xóa đối tượng
                            ?</Text>
                    </TouchableOpacity>
                </View>
            )
                : (
                <View style={{
                    marginLeft: width / 3,
                }}>
                    <TouchableOpacity
                        onPress={() => this.restoreCouple()}
                    >
                        <Text style={{
                            color: '#0350AA',
                            textDecorationLine: 'underline',
                        }}>Khôi phục tính năng cặp đôi</Text>
                    </TouchableOpacity>
                </View>
            )
        );

        return (
            <View style={wrapper}>
                <View style={header}>
                    <Text style={name}>{displayName}</Text>
                    <View style={btn}>
                        {!this.state.isUploadAvatar ?
                            <TouchableOpacity
                                style={{justifyContent: 'center', alignItems: 'center'}}
                                onPress={() => this.uploadAvatarHandle()}
                            >
                                <Image source={avatar === '' ? addAvatar : {uri: avatar}} style={avatarStyle}/>
                                <View style={{
                                    height: 100,
                                    width: 100,
                                    borderRadius: 50,
                                    backgroundColor: '#000',
                                    opacity: 0.5,
                                    position: 'absolute',
                                }}>
                                </View>
                                <Image source={icon_camera}
                                       style={{width: 25, height: 25, position: 'absolute'}}
                                />
                            </TouchableOpacity>
                            :
                            <ActivityIndicator/>
                        }
                    </View>
                </View>
                <View style={container}>
                    <ScrollView>
                        <View style={row}>
                            <Text >Họ</Text>
                            <TextInput
                                style={textInput}
                                underlineColorAndroid='transparent'
                                placeholder={'họ'}
                                value={firstName}
                                onChangeText={text => this.setState({firstName: text})}
                            />
                        </View>
                        <View style={row}>
                            <Text >Tên</Text>
                            <TextInput
                                style={textInput}
                                underlineColorAndroid='transparent'
                                placeholder={'tên'}
                                value={lastName}
                                onChangeText={text => this.setState({lastName: text})}
                            />
                        </View>
                        <View style={row}>
                            <Text>Email</Text>
                            <TextInput
                                style={textInput}
                                underlineColorAndroid='transparent'
                                value={email}
                                placeholder={'email'}
                                onChangeText={text => this.setState({email: text})}
                            />
                        </View>
                        <View style={row}>
                            <Text style={{marginRight: 10}}>Giới tính</Text>
                            <TouchableOpacity
                                onPress={() => this.setMaleGender()}
                                style={genderBtn}
                            >
                                <Image source={this.state.isMaleActive ? icon_male_active : icon_male}
                                       style={genderIcon}/>
                                <Text style={text}>Nam</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.setFemaleGender()}
                                style={genderBtn}
                            >
                                <Image source={this.state.isFemaleActive ? icon_female_active : icon_female}
                                       style={genderIcon}/>
                                <Text style={text}>Nữ</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={row}>
                            <Text >Ngày Sinh</Text>
                            <View style={{
                                flexDirection: 'row',
                                width: width / 2,
                                justifyContent: 'space-between',
                                marginLeft: 10
                            }}>
                                <ModalDropdown
                                    style={ModalDropdownStyle}
                                    defaultValue={day === '' ? 'Ngày' : day}
                                    dropdownStyle={{width: width / 6 - 2}}
                                    options={days}
                                    onSelect={(index, value) => this.setState({day: value})}
                                />
                                <ModalDropdown
                                    style={ModalDropdownStyle}
                                    defaultValue={month === '' ? 'Tháng' : month}
                                    dropdownStyle={{width: width / 6 - 2}}
                                    options={months}
                                    onSelect={(index, value) => this.setState({month: monthDigits[index]})}
                                />
                                <ModalDropdown
                                    style={ModalDropdownStyle}
                                    defaultValue={year === '' ? 'Năm' : year}
                                    dropdownStyle={{width: width / 6 - 2}}
                                    options={years}
                                    onSelect={(index, value) => this.setState({year: value})}
                                />
                            </View>
                        </View>
                        <View style={row}>
                            <TouchableOpacity
                                style={saveBtn}
                                onPress={() => this.updateProfileHandle()}
                            >
                                < Text style={{color: '#fff'}}>Save</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={targetSetting}>
                            <Text style={{marginLeft: width / 3}}>Cài đặt đối tượng</Text>
                            <Text style={{marginLeft: width / 3, marginBottom: 15}}>
                                ---------------------------------</Text>
                            <View style={row}>
                                <Text>Tên hiển thị</Text>
                                <View style={{
                                    height: 35,
                                    width: width / 2,
                                    borderRadius: 5,
                                    borderWidth: 0.5,
                                    backgroundColor: '#fff',
                                    marginLeft: 10,
                                    justifyContent: 'center',
                                    paddingLeft: 8
                                }}>
                                    < Text style={{
                                        color: '#000'
                                    }}>{target.displayName}</Text>
                                </View>
                            </View>
                            {targetOptionsView}
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#E9EBEE'
    },
    header: {
        flex: 3.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#A721B3'
    },
    container: {
        flex: 6.5,
        backgroundColor: '#E9EBEE',
        marginTop: 20,
        marginBottom: 30
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
        marginHorizontal: width / 6,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    text: {
        color: '#424242',
    },
    ModalDropdownStyle: {
        paddingLeft: 5,
        backgroundColor: '#fff',
        borderRadius: 2,
        borderWidth: 0.5,
        justifyContent: 'center',
        marginHorizontal: 1,
        width: width / 6 - 2,
        height: 30
    },
    textInput: {
        height: 40,
        width: width / 2,
        borderRadius: 5,
        borderWidth: 0.5,
        backgroundColor: '#fff',
        paddingBottom: 2,
        marginLeft: 10,
    },
    name: {
        fontSize: 20,
        color: '#fff',
        marginBottom: 10,
    },
    btn: {
        height: 100,
        width: 100,
        borderRadius: 50,
        backgroundColor: '#fff'
    },
    saveBtn: {
        height: 35,
        width: width / 2,
        borderRadius: 5,
        backgroundColor: '#A721B3',
        alignItems: 'center',
        justifyContent: 'center'
    },
    genderIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    genderBtn: {
        flexDirection: 'row',
        height: 35,
        width: width / 4 - 2,
        borderRadius: 5,
        borderWidth: 0.5,
        marginHorizontal: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarStyle: {
        height: 100,
        width: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.8
    },
    pickerStyle: {
        height: 35,
    },
    targetSetting: {
        marginTop: 20,
    }
});

function mapStateToProps(state) {
    return {
        user: state.authentication.user,
        target: state.authentication.target,
        couple: state.authentication.couple
    }
}

export default connect(mapStateToProps, {storeUser})(EditProfile);
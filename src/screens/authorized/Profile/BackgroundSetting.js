import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import getCoupleInfo from'../../../api/profile/getCoupleInfo';
import AsyncStorageAccess from '../../../api/AsyncStorageAccess';
import DatePicker from 'react-native-datepicker'


class BackgroundSetting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: null,
            slogan: '',
            time: ''
        }
    }

    componentDidMount() {
        let {couple} = this.props;
        this.setState({
            date: new Date(parseInt(couple.startTime)),
            slogan: couple.slogan
        })
        // AsyncStorageAccess.getFromStorage('@loginToken')
        //     .then(token => {
        //         if (token === '') {
        //             this.props.navigation.navigate('UnauthenStackNav')
        //         } else {
        //             getCoupleInfo(token)
        //                 .then(res => {
        //                     console.log('couple ìno', res);
        //                     this.setState({
        //                         date: new Date(parseInt(res.info.startTime)),
        //                         slogan: res.info.slogan
        //                     })
        //                 });
        //         }
        //     })
    }

    render() {

        const {wrapper, sloganStyle} = styles;

        return (
            <View style={wrapper}>
                <DatePicker
                    style={{width: 200}}
                    date={this.state.date}
                    mode="date"
                    placeholder="select date"
                    format="YYYY-MM-DD"
                    minDate="2010-01-01"
                    maxDate="2018-12-31"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    androidMode='spinner'
                    customStyles={{
                        dateIcon: {
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 10
                        },
                        dateText: {
                            fontSize: 25,
                        },
                        dateTouchBody: {
                            backgroundColor: 'red'
                        }

                    }}
                    onDateChange={(date) => {
                        this.setState({date: date})
                    }}
                />
                <TextInput
                    style={sloganStyle}
                    value={this.state.slogan}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(text) => this.setState({slogan: text})}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#FFE89C',
    },
    sloganStyle: {
        marginHorizontal: 24,
        borderBottomWidth: 0.5,
        paddingBottom: 2,
    }
});

export default connect((state) => {
    return {
        couple: state.authentication.couple
    }
})(BackgroundSetting);

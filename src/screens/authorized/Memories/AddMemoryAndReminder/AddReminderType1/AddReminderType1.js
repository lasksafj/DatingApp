/**
 * Created by XuanVinh on 8/15/2017.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Platform,
    TextInput,
    Text,
    TouchableOpacity,
    View,
    Button,
    ScrollView,
    Modal,
    TouchableHighlight
} from 'react-native';
import Timeline from 'react-native-timeline-listview'
import Hr from 'react-native-hr'
import AsyncStorageAccess from '../../../../../api/AsyncStorageAccess';
import moment from 'moment'

//import actions
import {
    getAllRemindersType1,
    setReminderType1,
    editReminderType1,
    cancelReminderType1,
    addNewReminderType1
} from '../../../../../actions/reminderAction'

//import APIs
import {getAllTimeUnit} from '../../../../../api/MemoryAndReminderAPI'

const loveIcon = require('../../../../../media/icons/love.png');

export default class AddReminderType1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            modalVisible: false,
            modalVisible1: false,
            modalVisible2: false,
            hourBefore: "",
            currentRemindId: "",
            token: "",
            units: [],
            chosenUnit: "",
            anniversaryNumber: "0"
        }

        this.renderDetail = this.renderDetail.bind(this)
        this.setModal = this.setModal.bind(this)
        this.setModal1 = this.setModal1.bind(this)
        this.setModal2 = this.setModal2.bind(this)
        this.setReminder = this.setReminder.bind(this)
        this.editReminder = this.editReminder.bind(this)
        this.cancelReminder = this.cancelReminder.bind(this)
        this.chooseTimeUnit = this.chooseTimeUnit.bind(this)
        this.addNewReminderType1 = this.addNewReminderType1.bind(this)
    }

    componentWillMount() {
        AsyncStorageAccess.getFromStorage('@loginToken')
            .then(token => {
                getAllRemindersType1(token);
                getAllTimeUnit(token)
                    .then(res => {
                        this.setState({
                            token: token,
                            units: res.units,
                            chosenUnit: res.units[0]
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    })

            });
    }

    componentWillReceiveProps(nextProps) {
        const reminders = nextProps.remindersType1;
        let data = [];
        reminders.map(reminder => {
            data.push({
                id: reminder._id,
                time: reminder.mileStone.number + " " + reminder.mileStone.unit,
                title: reminder.content,
                icon: loveIcon,
                remindTime: reminder.remindDateTime,
                countDownAt: reminder.countDownAt
            })
        })
        this.setState({
            data: data
        })
    }

    renderDetail(rowData, sectionID, rowID) {
        let title = <Text style={[styles.title]}>{rowData.title}</Text>
        let setRemindButton = null;
        if (moment().isAfter(moment(rowData.remindTime, "DD-MM-YYYY HH:mm"))) {
            setRemindButton = <View style={styles.expiredContainer}>
                <Text style={styles.expiredText}>Đã qua</Text>
            </View>
        } else {
            if (rowData.countDownAt === "") {
                setRemindButton = <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            modalVisible: true,
                            currentRemindId: rowData.id,
                            hourBefore: ""
                        })
                    }
                    }
                    style={styles.setRemindButton}
                >
                    <Text style={styles.setRemindButtonTitle}>Hẹn lịch</Text>
                </TouchableOpacity>
            } else {
                setRemindButton = <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            modalVisible1: true,
                            currentRemindId: rowData.id,
                            hourBefore: ""
                        })
                    }
                    }
                    style={styles.setRemindButton}
                >
                    <Text style={styles.setRemindButtonTitle}>Đã hẹn lịch vào {rowData.remindTime}</Text>
                </TouchableOpacity>
            }
        }


        return (
            <View style={{flex: 1, alignItems: 'center'}}>
                {title}
                {setRemindButton}
            </View>
        )
    }

    setModal(visible) {
        this.setState({
            modalVisible: visible
        })
    }

    setModal1(visible) {
        this.setState({
            modalVisible1: visible
        })
    }

    setModal2(visible) {
        this.setState({
            modalVisible2: visible
        })
    }

    setReminder() {
        setReminderType1(this.state.token, {
            id: this.state.currentRemindId,
            alertBefore: this.state.hourBefore
        });
    }

    editReminder() {
        editReminderType1(this.state.token, {
            id: this.state.currentRemindId,
            alertBefore: this.state.hourBefore
        });
    }

    cancelReminder() {
        cancelReminderType1(this.state.token, this.state.currentRemindId);
    }

    chooseTimeUnit(unit) {
        this.setState({
            chosenUnit: unit
        })
    }

    addNewReminderType1() {
        addNewReminderType1(this.state.token, this.state.anniversaryNumber, this.state.chosenUnit);
    }

    render() {
        return (<View style={styles.outerContainer}>
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.setModal(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View>
                        <Text style={styles.inputTitle}>Báo trước (giờ)</Text>
                        <TextInput
                            style={[styles.textInput]}
                            underlineColorAndroid={'transparent'}
                            placeholder={'Nhập giờ'}
                            placeholderTextColor={'#c9c9c9'}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                this.setState({
                                    hourBefore: text
                                })
                            }}
                            value={this.state.hourBefore}
                        />
                        <Hr lineColor='#B0BEC5'/>
                        <View style={styles.modelActions}>
                            <TouchableHighlight
                                onPress={() => {
                                    this.setModal(false);
                                }}
                            >
                                <Text style={styles.modalActionText}>Tắt</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => {
                                    this.setReminder();
                                    this.setModal(false);
                                }}
                            >
                                <Text style={styles.modalActionText}>Hoàn tất</Text>
                            </TouchableHighlight>
                        </View>


                    </View>
                </View>
            </Modal>
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible1}
                onRequestClose={() => {
                    this.setModal1(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View>
                        <Text style={styles.inputTitle}>Báo trước (giờ)</Text>
                        <TextInput
                            style={[styles.textInput]}
                            underlineColorAndroid={'transparent'}
                            placeholder={'Nhập giờ'}
                            placeholderTextColor={'#c9c9c9'}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                this.setState({
                                    hourBefore: text
                                })
                            }}
                            value={this.state.hourBefore}
                        />
                        <Hr lineColor='#B0BEC5'/>
                        <View style={styles.modelActions}>
                            <TouchableHighlight
                                onPress={() => {
                                    this.setModal1(false);
                                }}
                            >
                                <Text style={styles.modalActionText}>Tắt</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => {
                                    this.cancelReminder();
                                    this.setModal1(false);
                                }}
                            >
                                <Text style={styles.modalActionText}>Hủy hẹn lịch</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => {
                                    this.editReminder();
                                    this.setModal1(false);
                                }}
                            >
                                <Text style={styles.modalActionText}>Hoàn tất</Text>
                            </TouchableHighlight>
                        </View>


                    </View>
                </View>
            </Modal>
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible2}
                onRequestClose={() => {
                    this.setModal(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View>
                        <Text style={styles.inputTitle}>Chọn đơn vị thời gian</Text>
                        <View style={styles.unitRadioContainer}>
                            {this.state.units.map(unit => <TouchableHighlight
                                key={unit._id}
                                onPress={() => {
                                    this.chooseTimeUnit(unit);
                                }}
                            >
                                <Text
                                    style={unit._id == this.state.chosenUnit._id ? styles.chosenText : styles.text}>{unit.name}</Text>
                            </TouchableHighlight>)}
                        </View>
                        <View style={styles.setNewAnniversaryContainer}>
                            <Text style={styles.inputTitle}>Thiết lập kỉ niệm mới tại </Text>
                            <TextInput
                                style={[styles.textInput2]}
                                underlineColorAndroid={'transparent'}
                                keyboardType="numeric"
                                onChangeText={(text) => {
                                    this.setState({
                                        anniversaryNumber: text
                                    })
                                }}
                                value={this.state.anniversaryNumber}
                            />
                            <Text style={styles.inputTitle}>{this.state.chosenUnit.name}</Text>
                        </View>
                        <Hr lineColor='#B0BEC5'/>
                        <View style={styles.modelActions}>
                            <TouchableHighlight
                                onPress={() => {
                                    this.setModal2(false);
                                }}
                            >
                                <Text style={styles.modalActionText}>Tắt</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => {
                                    this.addNewReminderType1();
                                    this.setModal2(false);
                                }}
                            >
                                <Text style={styles.modalActionText}>Hoàn tất</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
            <Button
                onPress={() => {
                    this.setModal2(true);
                }}
                title={"Thêm mốc thời gian"}
                color="#F06292"
            />
            <ScrollView>
                <Timeline
                    style={styles.list}
                    data={this.state.data}
                    circleSize={30}
                    circleColor='rgba(0,0,0,0)'
                    columnFormat='two-column'
                    lineColor='rgb(45,156,219)'
                    timeContainerStyle={{width: 100}}
                    timeStyle={{
                        textAlign: 'center',
                        backgroundColor: '#ff9797',
                        color: 'white',
                        padding: 5,
                        borderRadius: 13
                    }}
                    descriptionStyle={{color: 'gray'}}
                    options={{
                        style: {paddingTop: 5}
                    }}
                    innerCircle={'icon'}
                    separator={false}
                    detailContainerStyle={{marginBottom: 20, paddingLeft: 5, paddingRight: 5, borderRadius: 10}}
                    renderDetail={this.renderDetail}
                />
            </ScrollView>
        </View>)
    }
}

const styles = StyleSheet.create({
    outerContainer: {
        paddingBottom: 100
    },
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 65,
        backgroundColor: 'white'
    },
    list: {
        flex: 1,
        marginTop: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    descriptionContainer: {
        flexDirection: 'row',
        paddingRight: 50
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    textDescription: {
        marginLeft: 10,
        color: 'gray'
    },
    setRemindButton: {
        borderRadius: 5,
        backgroundColor: "white",
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#2196F3',
        borderWidth: 2,
        width: '100%'
    },
    setRemindButtonTitle: {
        color: '#2196F3',
        fontSize: 16,
    },
    textInput: {
        fontSize: 16,
        borderWidth: 0,
    },
    textInput2: {
        fontSize: 16,
        borderWidth: 0,
        width: 50,
        textAlign: "right"
    },
    inputTitle: {
        fontSize: 16,
        marginLeft: 5,
        color: "black"
    },
    modalContainer: {
        marginTop: 120,
        marginBottom: 120,
        marginRight: 20,
        marginLeft: 20,
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5
    },
    modelActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    modalActionText: {
        color: '#F06292',
        fontSize: 16,
        margin: 10
    },
    expiredContainer: {
        borderRadius: 5,
        backgroundColor: "#E0E0E0",
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    expiredText: {
        fontSize: 16,
        color: 'black'
    },
    unitRadioContainer: {
        marginHorizontal: 10
    },
    text: {
        fontSize: 16
    },
    chosenText: {
        fontSize: 16,
        color: 'black'
    },
    setNewAnniversaryContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});
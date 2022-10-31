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
    Dimensions,
    Image,
    Modal,
    TouchableHighlight,
    ImageStore
} from 'react-native';
import moment from 'moment'
import CameraRollPicker from'react-native-camera-roll-picker'
import Hr from 'react-native-hr'
const {width, height} = Dimensions.get('window');
import AsyncStorageAccess from '../../../../../api/AsyncStorageAccess';

//import actions
import {addMemory} from '../../../../../actions/memoryAction'

export default class AddMemory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            memory: {
                text: "",
                images: [],
                created_at: ""
            },
            choseImages: [],
            imagesTemp: [],
            modalVisible: false,
            token: ""
        }

        this._onAddMemory = this._onAddMemory.bind(this);
        this._onChooseImage = this._onChooseImage.bind(this);
        this.setModal = this.setModal.bind(this);
        this.setImages = this.setImages.bind(this);
        this.unchooseImage = this.unchooseImage.bind(this);
    }

    componentWillMount() {
        AsyncStorageAccess.getFromStorage('@loginToken')
            .then(token => {
                this.setState({
                    token: token
                })
            });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            choseImages: nextProps.choseImages,
        })
    }

    _onAddMemory() {
        const images = this.state.choseImages;
        let memory = {
            text: this.state.memory.text,
            created_at: moment().format("DD-MM-YYYY HH:mm"),
            images: []
        };
        images.map((image, index) => {
            ImageStore.getBase64ForTag(image.uri, (data) => {
                memory.images.push(data);
                if (memory.images.length == images.length) {
                    addMemory(this.state.token, memory);
                }
            }, (error) => {
                console.log(error);
            })
        });

    }

    _onChooseImage() {
        this.setState({
            modalVisible: true
        })
        // this.props.navigation.navigate('ChooseImage');
    }

    setModal(visible) {
        this.setState({
            modalVisible: visible
        })
    }

    setImages() {
        this.setState({
            choseImages: this.state.imagesTemp,
        })
    }

    unchooseImage(uri) {
        let images = this.state.choseImages;
        images = images.filter((image) => image.uri != uri);
        this.setState({
            choseImages: images,
            imagesTemp: images
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                    this.setModal(false);
                }}
                >
                    <View style={styles.modalContainer}>
                        <View style={{flex: 8}}>
                            <ScrollView>
                                <CameraRollPicker
                                    scrollRenderAheadDistance={500}
                                    initialListSize={1}
                                    pageSize={3}
                                    removeClippedSubviews={false}
                                    groupTypes='SavedPhotos'
                                    batchSize={5}
                                    selected={this.state.imagesTemp}
                                    assetType='Photos'
                                    imagesPerRow={3}
                                    imageMargin={5}/>
                            </ScrollView>
                        </View>
                        <View style={{flex: 2}}>
                            <Hr lineColor='#B0BEC5'/>
                            <View style={styles.modelActions}>
                                <TouchableHighlight
                                    onPress={()=>{
                                    this.setModal(false);
                                }}
                                >
                                    <Text style={styles.modalActionText}>Tắt</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={()=>{
                                    this.setImages();
                                    this.setModal(false);
                                }}
                                >
                                    <Text style={styles.modalActionText}>Chọn</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
                <ScrollView>
                    <TextInput
                        style={styles.textInput}
                        underlineColorAndroid={'transparent'}
                        multiline={true}
                        numberOfLines={5}
                        placeholder={'Bạn muốn đăng gì?'}
                        placeholderTextColor={'#c9c9c9'}
                        onChangeText={(text)=>{
                            let memory = this.state.memory;
                            memory.text = text;
                            this.setState({
                                memory: memory
                            })
                        }}
                        value={this.state.memory.text}
                    />
                    <View style={styles.toolbar}>
                        <Button
                            onPress={this._onChooseImage}
                            title={"+ Ảnh"}
                            color="#1976D2"
                            style={styles.icon}
                        />
                    </View>
                    <View>
                        {this.state.choseImages.map(image => <Image
                            key={image.uri}
                            source={{uri: image.uri}}
                            style={{
                                width: width,
                                height: width*image.height/image.width,
                                marginBottom: 5
                            }}
                        >
                            <TouchableOpacity
                                onPress={()=>{
                                            this.unchooseImage(image.uri);
                                        }}
                            >
                                <View style={styles.deleteCorner}>
                                    <View style={styles.deleteContainer}>
                                        <Text style={styles.deleteText}>✖</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Image>)}
                    </View>
                    <Button
                        onPress={this._onAddMemory}
                        title={"Hoàn tất"}
                        color="#F06292"
                    />
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 65
    },
    textInput: {
        borderWidth: 0,
        textAlignVertical: 'top',
        fontSize: 16
    },
    inputTitle: {
        marginLeft: 5,
        color: "black",
        fontSize: 16
    },
    toolbar: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10
    },
    icon: {
        width: 100,
    },
    modalContainer: {
        marginTop: 20,
        marginBottom: 20,
        // marginRight: 20,
        // marginLeft: 20,
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
    deleteCorner: {
        alignItems: "flex-end"
    },
    deleteContainer: {
        borderRadius: 15,
        width: 30,
        height: 30,
        backgroundColor: "#78909C",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
        marginRight: 15
    },
    deleteText: {
        color: "white",
        fontSize: 20
    },
    flex1: {
        flex: 1
    }
})
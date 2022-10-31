import PropTypes from 'prop-types';
import React from 'react';
import {TouchableOpacity, View, Image, Modal, Text} from 'react-native';
import CameraRollPicker from 'react-native-camera-roll-picker';
import RNFetchBlob from 'react-native-fetch-blob';

let con;
export default class CustomActions extends React.Component {
    constructor(props) {
        super(props);
        con = this;
        con._images = [];
        con.state = {
            modalVisible: false,
        };
    }

    selectImages(images) {
        con._images = images;
    }

    renderNavBar() {
        return (
            <View style={{
                flex: 0.1,
                backgroundColor: '#C13BCE',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <TouchableOpacity onPress={() => {
                    con.setState({modalVisible: false});
                }}>
                    <Text style={{
                        color: '#000',
                    }}>
                        Cancel
                    </Text>
                </TouchableOpacity>

                <Text style={{
                    color: '#000',
                }}>
                    Camera Roll
                </Text>
                <TouchableOpacity onPress={() => {
                    con.setState({modalVisible: false});

                    var imagesMessage = con._images.map((image) => {
                        return RNFetchBlob.fs.readFile(image.uri, 'base64')
                        .then((dataBase64) => {
                            console.log('dataBase64', dataBase64);
                            return {
                                image: {
                                    type: 'uri',
                                    content: image.uri,
                                },
                                imageData: dataBase64
                            };
                        })
                    })
                    Promise.all(imagesMessage).then((images) => {
                        con.props.sendImages(images);
                        con._images = [];
                    })
                }}>
                    <Text style={{
                        color: '#000',
                    }}>
                        Send
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <View style={{flexDirection: 'row', backgroundColor: '#d8d8d8'}}>
                <TouchableOpacity
                    onPress={() => {
                        con.props.emoji();
                    }}
                >
                    <Image
                        style={{width: 26, height: 26, margin: 10,}}
                        source={require('../../../media/icons/icon_emoij.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        con.props.gify();
                    }}
                >
                    <Image
                        style={{width: 26, height: 26, margin: 10,}}
                        source={require('../../../media/icons/gif-icon.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        con.setState({modalVisible: true});
                    }}>
                    <Modal
                        animationType={'slide'}
                        transparent={false}
                        visible={con.state.modalVisible}
                        onRequestClose={() => {
                            con.setState({modalVisible: false});
                        }}
                    >
                        {con.renderNavBar()}
                        <CameraRollPicker
                            maximum={10}
                            imagesPerRow={4}
                            callback={con.selectImages}
                            selected={[]}
                        />
                    </Modal>
                    <Image
                        style={{width: 26, height: 26, margin: 10,}}
                        source={require('../../../media/icons/send-image.png')}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

CustomActions.defaultProps = {
    emoji: () => {
    },
    gify: () => {
    },
    sendImages: () => {},
};

CustomActions.propTypes = {
    emoji: PropTypes.func,
    gify: PropTypes.func,
    sendImages: PropTypes.func,
};

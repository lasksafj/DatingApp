/**
 * Created by XuanVinh on 8/13/2017.
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
    Image,
    Dimensions
} from 'react-native';
const {width, height} = Dimensions.get('window');
import {host_domain} from '../../../../config/config'

export default class MemoryImages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: []
        }
    }

    componentWillMount() {
        this.setState({
            images: this.props.images
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            images: nextProps.images
        })
    }

    render() {
        let imagesShow = null;
        const images = this.state.images;
        if (images.length !== 0) {
            if (images.length === 1) {
                console.log("adsadasds");
                imagesShow = <View>
                    <Image
                        source={{uri: host_domain + "/images/memory/" + images[0]}}
                        style={styles.oneImage}
                    />
                </View>
            } else if (images.length === 2) {
                imagesShow = <View style={styles.imageRow}>
                    <Image
                        source={{uri: host_domain + "/images/memory/" + images[0]}}
                        style={styles.twoImage1}
                    />
                    <Image
                        source={{uri: host_domain + "/images/memory/" + images[1]}}
                        style={styles.twoImage2}
                    />
                </View>
            } else if (images.length === 3) {
                imagesShow = <View>
                    <Image
                        source={{uri: host_domain + "/images/memory/" + images[0]}}
                        style={[styles.oneImage, {marginBottom: 4}]}
                    />
                    <View style={styles.imageRow}>
                        <Image
                            source={{uri: host_domain + "/images/memory/" + images[1]}}
                            style={styles.twoImage1}
                        />
                        <Image
                            source={{uri: host_domain + "/images/memory/" + images[2]}}
                            style={styles.twoImage2}
                        />
                    </View>
                </View>
            } else {
                imagesShow = <View>
                    <Image
                        source={{uri: host_domain + "/images/memory/" + images[0]}}
                        style={[styles.oneImage, {marginBottom: 4}]}
                    />
                    <View style={styles.imageRow}>
                        <Image
                            source={{uri: host_domain + "/images/memory/" + images[1]}}
                            style={styles.threeImage1}
                        />
                        <Image
                            source={{uri: host_domain + "/images/memory/" + images[2]}}
                            style={styles.threeImage2}
                        />
                        <Image
                            source={{uri: host_domain + "/images/memory/" + images[3]}}
                            style={styles.threeImage3}
                        >{images.length > 4 ? <View
                            style={styles.textContainer}
                        >
                            <Text
                                style={styles.moreThan4ImagesText}
                            >+{images.length - 4}</Text>
                        </View> : null}</Image>
                    </View>
                </View>
            }
        }
        return (<View>
            {imagesShow}
        </View>)
    }
}

const styles = StyleSheet.create({
    oneImage: {
        width: width,
        height: 200
    },
    imageRow: {
        flexDirection: 'row',
    },
    twoImage1: {
        marginRight: 2,
        width: (width - 4) / 2,
        height: (width - 4) / 2
    },
    twoImage2: {
        marginLeft: 2,
        width: (width - 4) / 2,
        height: (width - 4) / 2
    },

    threeImage1: {
        marginRight: 2,
        width: (width - 8) / 3,
        height: (width - 8) / 3
    },
    threeImage2: {
        marginRight: 2,
        marginLeft: 2,
        width: (width - 8) / 3,
        height: (width - 8) / 3
    },
    threeImage3: {
        marginLeft: 2,
        width: (width - 8) / 3,
        height: (width - 8) / 3
    },
    textContainer: {
        height: (width - 8) / 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    moreThan4ImagesText: {
        fontSize: 50,
        color: "white"
    }
})
/**
 * Created by minhphan on 8/17/2017.
 */
import {StyleSheet, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

const callingStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flex: 3,
        backgroundColor: '#7F0081',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 7,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        paddingBottom: 30,
    },
    btn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#7F0081',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnHangup: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FA4C4D',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowBtn: {
        flexDirection: 'row',
        width: width,
        justifyContent: 'space-around',
        paddingHorizontal: 20
    },
    imageStyle: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    name: {
        marginTop: 10,
        color: '#fff',
        fontSize: 15,
    },
    text: {
        fontSize: 20,
        color: '#222222',
        marginTop: 10
    }
});

const VideoCallingStyle = StyleSheet.create({
    selfView: {
        alignSelf: 'flex-end',
        width: 100,
        height: 100,
        position: 'absolute',
    },
    videoCallView: {
        justifyContent: 'flex-end',
        flex: 8,
        backgroundColor: 'gray',
        marginHorizontal: 5
    },
    remoteView: {
        flex: 1,
    },
    btnView: {
        flex: 2,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10,
    },
    buttonsModal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: height / 6
    },
    phoneBtn: {
        width: 50,
        height: 50
    },

    headerModal: {
        color: '#fff',
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 20,
    },
    row: {
        flexDirection: 'row',
        marginTop: 40,
        justifyContent: 'space-around',
        paddingHorizontal: 10
    }
});

module.exports = {
    callingStyles,
    VideoCallingStyle
};

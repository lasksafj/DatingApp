/**
 * Created by minhphan on 8/7/2017.
 */
import {StyleSheet, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

const SigInStyle = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    status: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    backgroundImage: {
        width: width,
        height: height
    },
    container: {
        flex: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        flex: 2,
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 17,
        fontFamily: 'Roboto',
        fontWeight: 'normal'
    },
    textInputBox: {
        height: 40,
        width: width * 2 / 3,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginVertical: 5,
        paddingHorizontal: 15,
        paddingTop: 10,
        alignItems: 'center',
        opacity: 0.8,
        color: '#000'
    },
    nameInputBox: {
        height: 40,
        width: width * 2 / 6 - 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginVertical: 5,
        marginHorizontal: 1,
        paddingHorizontal: 15,
        paddingTop: 10,
        alignItems: 'center',
        opacity: 0.8,
        color: '#000'
    },
    invalid_textInputBox: {
        height: 40,
        width: width * 2 / 3,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginVertical: 10,
    },
    button: {
        height: 40,
        width: width * 2 / 3,
        borderRadius: 5,
        backgroundColor: '#8400C3',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    text: {
        color: '#fff',
    },
    signInFBBtn: {
        flexDirection: 'row',
        height: 40,
        width: width * 2 / 6,
        borderRadius: 5,
        backgroundColor: '#3B5998',
        alignItems: 'center',
        marginVertical: 10,
        justifyContent: 'space-around',
        marginRight: 1
    },
    signInGGBtn: {
        flexDirection: 'row',
        height: 40,
        width: width * 2 / 6,
        borderRadius: 5,
        backgroundColor: '#DD4B38',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginVertical: 10,
        marginLeft: 1
    },
    imageStyle: {
        width: 30,
        height: 30
    },
});

module.exports = {
    SigInStyle
};

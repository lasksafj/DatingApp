import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import MapView from 'react-native-maps';
import io from 'react-native-socket.io-client';

// const socket = io('http://192.168.1.28:3000', {jsonp: false});

// class GetCurrentLocation extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             region: {
//                 latitude: 16.065352,
//                 longitude: 108.1539047,
//                 latitudeDelta: 0.0922,
//                 longitudeDelta: 0.0421,
//             },
//             mylocation: {
//                 latitude: 0,
//                 longitude: 0,
//                 latitudeDelta: 0.01,
//                 longitudeDelta: 0.01
//             },
//             position: ''
//         }
//     }
//
//     componentDidMount() {
//         // socket.on('connect', () => {
//         //     console.log('ready to emit');
//         //     console.log('connected!');
//         // });
//     }
//
//     // checkinHandle() {
//     //     console.log('hello');
//     //     navigator.geolocation.getCurrentPosition(position => {
//     //             console.log('position', position.coords);
//     //             // this.setState({
//     //             //     mylocation: {
//     //             //         latitude: position.coords.latitude,
//     //             //         longitude: position.coords.longitude,
//             //         latitudeDelta: 0.01,
//             //         longitudeDelta: 0.01
//             //     },
//             //     position: JSON.stringify(position),
//             // });
//             // // socket.emit('client-send-location',
//             //     {
//             //         latitude: this.state.mylocation.latitude,
//             //         longitude: this.state.mylocation.longitude
//             //     });
//         },
//         (error) => alert(JSON.stringify(error)),
//         {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000}
//     );

// function GetCurrenLocation() {
//
// }


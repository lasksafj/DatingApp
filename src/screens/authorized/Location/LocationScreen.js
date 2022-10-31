import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Button} from 'react-native';
import {connect} from 'react-redux';
import MapView from 'react-native-maps';

class Location extends Component {
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 16.065352,
                longitude: 108.1539047,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            },
            currentLocation: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            },
            targetLocation: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }
        }
    }

    componentDidMount() {
        this.props.socket.on('Server-send-target-location', (position) => {
            if (position !== null) {
                this.setState({
                    targetLocation: {
                        latitude: position.latitude,
                        longitude: position.longitude
                    }
                })
            }
        })
    }

    checkInHandle() {
        navigator.geolocation.getCurrentPosition(position => {
                console.log('get current position');
                console.log('position', position.coords);
                this.setState({
                    currentLocation: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }
                });
                this.props.socket.emit('Client-check-in-location', this.state.currentLocation);
            },
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 10000, maximumAge: 3000}
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 8}}>
                    <MapView
                        style={{flex: 1}}
                        region={this.state.region}
                    >
                        <MapView.Marker
                            coordinate={this.state.region}
                            title={"your location"}
                        />
                    </MapView>
                </View>
                <View style={{flex: 2}}>
                    <TouchableOpacity
                        onPress={this.checkInHandle.bind(this)}
                    >
                        <Text>Check in</Text>
                    </TouchableOpacity>
                    <Text>{this.state.position}</Text>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.authentication.user,
        target: state.authentication.target,
        socket: state.socket.socket,
    }
}

export default connect(mapStateToProps)(Location);

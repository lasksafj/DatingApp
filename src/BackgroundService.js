import React, {Component} from 'react';
import {View, Text, AppState} from 'react-native';


class BackgroundService extends Component {

    render() {
        setInterval(() => {
            console.log('fhjhjh');
        }, 2000)
        // return (
        //     <View style={{flex: 1}}>
        //         <Text>Memories</Text>
        //     </View>
        // );
    }
}

export default BackgroundService;

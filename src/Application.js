/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, AppState} from 'react-native';
import {Provider} from 'react-redux';
import store from './stores';
import AppNavigator from'./AppNavigator';
import Location from "./screens/authorized/Location/LocationScreen";
class Application extends Component {

    // constructor(props) {
    //     super(props);
    //     this.appState = AppState.currentState;
    //     AppState.addEventListener('change', (nextAppState) => {
    //         console.log('appstate', nextAppState);
    //         if (this.appState.match(/active/) && (nextAppState === 'background' || nextAppState === 'inactive')) {
    //             AppRegistry.registerHeadlessTask('SomeTaskName', () => console.log('helodsfdskj'));
    //         }
    //     });
    // }

    render() {
        return (
            <Provider store={store}>
                <AppNavigator/>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('LoveApp', () => Application);


/*
 <Provider store={store}>
 <AppNavigator/>
 </Provider>
 */
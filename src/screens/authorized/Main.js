import React, {Component} from 'react';
import {AppState} from 'react-native';
import {connect} from 'react-redux';
import PushNotification from 'react-native-push-notification';
import {AccessSocket} from '../../actions/Socket';
import {MainDrawerNav} from'../../navigation/MainDrawerNav';
import {getScreen} from '../../actions/GetScreen';

class Main extends Component {
    static navigationOptions = {
        header: null,
        drawer: null
    };

    componentWillMount() {
        this.props.socket.emit('Initialize', this.props.user);
        this.props.socket.emit('LoadRequestFriend');
    }

    componentDidMount() {
        this.props.socket.on('test-socket', (data) => {
            console.log(data);
            this.props.socket.emit('Test-Socket', {
                content: 'hello',
            });
        });
    }

    render() {
        return (
            <MainDrawerNav
                onNavigationStateChange={(prevState, currentState) => {
                    const currentScreen = getCurrentRouteName(currentState);
                    const prevScreen = getCurrentRouteName(prevState);
                    if(prevScreen === 'CallHandleScreen' || prevScreen === 'ChatTabView' || prevScreen === 'DrawerOpen') {
                        this.props.getScreen(currentScreen, prevScreen, null);
                    }
                    else {
                        this.props.getScreen(currentScreen, prevScreen, prevScreen);
                    }
                }}
            />
        );
    }
}

function getCurrentRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getCurrentRouteName(route);
    }
    return route.routeName;
}

function mapStateToProps(state) {
    return {
        user: state.authentication.user,
        target: state.authentication.target,
        socket: state.socket.socket,
        screen: state.navigation.screen,
    }
}

export default connect(mapStateToProps, {AccessSocket, getScreen})(Main);

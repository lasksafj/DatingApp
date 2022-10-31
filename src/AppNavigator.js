/**
 * Created by minhphan on 7/1/2017.
 */
import React, {Component} from 'react';
import {addNavigationHelpers} from 'react-navigation';
import {connect} from 'react-redux';
import {RootNav} from './navigation/RootNav';

class AppNavigator extends Component {
    render() {
        return (
            <RootNav
                navigation={addNavigationHelpers({
                    dispatch: this.props.dispatch,
                    state: this.props.nav
                })}
            />
        );
    }
}

export default connect(state => ({nav: state.nav}))(AppNavigator);
/**
 * Created by XuanVinh on 8/15/2017.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Platform,
    TextInput,
    Text,
    TouchableOpacity,
    FlatList,
    View
} from 'react-native';

import {connect} from 'react-redux';

//import components
import AddMemoryComponent from './AddMemoryComponent'

//import actions

class AddMemoryContainer extends Component {
    render() {
        console.log("container",this.props);
        return(<AddMemoryComponent
            choseImages={this.props.choseImages}
            navigation={this.props.navigation}

        />)
    }
}

mapStateToProps = (state, ownProps) => {
    return {choseImages: state.choseImages}
}

mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMemoryContainer);
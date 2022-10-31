/**
 * Created by XuanVinh on 8/13/2017.
 */
import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import moment from 'moment'

//import component
import MemoryAvatarAndText from './MemoryAvatarAndText'
import MemoryImages from './MemoryImages'

export default class Memory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memory: null
        }
    }

    componentWillMount() {
        this.setState({
            memory: this.props.memory
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            memory: nextProps.memory
        })
    }

    render() {
        const memory = this.state.memory;
        return (<View style={styles.container}>
            <MemoryAvatarAndText memory={memory}/>
            {memory.images.length !== 0 ?
                <MemoryImages images={memory.images}/> : null}
        </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginTop: 10,
    }
});
/**
 * Created by XuanVinh on 8/13/2017.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import Hr from 'react-native-hr'
import moment from 'moment'

//import component
import Memory from './Memory'

export default class Memories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            memories: []
        }
    }

    componentWillMount() {
        // let memories = this.props.memories.data;
        // memories.map(memory => {
        //     memory.user = this.props.user;
        //     memory.target = this.props.target;
        // })
        // this.setState({
        //     memories: memories
        // })
    }

    componentWillReceiveProps(nextProps) {
        let memories = nextProps.memories;
        console.log(11111, memories);
        memories.map(memory => {
            memory.user = nextProps.user;
            memory.target = nextProps.target;
        });
        this.setState({
            memories: memories
        })
    }

    _renderItem = ({item}) => (
        <Memory memory={item}/>
    );

    _keyExtractor = (item, index) => item._id;

    render() {
        const memories = this.state.memories;
        return (
            <View style={styles.container}>
                {memories.map(memory => <Memory key={memory._id} memory={memory}/>) }
            </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 65
    }
//     <FlatList
//     data={this.state.memories}
// extraData={this.state.memories}
// keyExtractor={this._keyExtractor}
// renderItem={this._renderItem}
// />
})
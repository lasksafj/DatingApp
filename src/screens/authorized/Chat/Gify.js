import React from 'react'
import styled from 'styled-components/native'
import {
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Image,
} from 'react-native'

import Gifs from './Gifs.js'

/* list of emoji's sourced from http://getemoji.com */

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gifys: Gifs.GifName.tuzki,
            gifyCategory: 'tuzki'
        }
    }

    static get propTypes() {
        return {
            onGifySelected: React.PropTypes.func.isRequired,
            visible: React.PropTypes.bool
        }
    }

    static get defaultProps() {
        return {
            visible: true,
        }
    }

    toggleGify(gify) {
        this.setState({gifys: Gifs.GifName[gify], gifyCategory: Gifs.GifName[gify]})
    }

    onGifySelect(gify) {
        this.props.onGifySelected(gify)
    }

    renderTabs() {
        const {gifyCategory} = this.state;

        return (
            <Tabs>
                {
                    Gifs.GifTitle.map((title, index) => (
                        <TouchableOpacity
                            key={index}
                            selected={gifyCategory === title}
                            onPress={() => {
                                this.toggleGify(title)
                            }}
                        >
                            <Image
                                key={index}
                                style={{width: 40, height: 40, marginBottom: 10, marginLeft: 10}}
                                source={Gifs.Gifs[title+'1']}
                            />
                        </TouchableOpacity>
                    ))
                }
            </Tabs>
        )
    }

    render() {
        const {gifys} = this.state;
        const {visible} = this.props;
        return (
            <Wrapper visible={visible}>
                <View style={{flex: 0.3}}>
                    {this.renderTabs()}
                </View>
                <ScrollView>
                    <GifyWrapper>
                        {
                            gifys.map((gify, index) => (
                                <GifyHighlight
                                    key={index}
                                    onPress={() => {
                                        this.onGifySelect(gify)
                                    }}
                                >
                                    <Gify
                                        key={index}
                                        source={Gifs.Gifs[gify]}
                                    />
                                </GifyHighlight>
                            ))
                        }
                    </GifyWrapper>

                </ScrollView>
            </Wrapper>
        )
    }
}

const Wrapper = styled.View`
  opacity: ${props => props.visible ? 1 : 0};
`;

const GifyWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-self: stretch;
  flex-wrap: wrap;
  height: 200;
`;

const GifyHighlight = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Gify = styled.Image`
  height: 50;
  width: 50;
`;

const Tabs = styled.View`
  flex: 1;
  flex-direction: row;
  height: 40;
  flex-wrap: wrap;
  align-self: stretch;
`;

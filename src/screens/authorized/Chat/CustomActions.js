import PropTypes from 'prop-types';
import React from 'react';
import {TouchableOpacity, View, Image} from 'react-native';
import ImagePicker from 'react-native-image-picker'

let con;
export default class CustomActions extends React.Component {
    constructor(props) {
        super(props);
        con=this;
    }

    selectPhotoTapped(cb) {
      const options = {
        quality: 1.0,
        maxWidth: 1000,
        maxHeight: 1000,
        storageOptions: {
          skipBackup: true
        }
      };

      ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled photo picker');
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
        else {
          cb(response);
        }
      });
    }

    render() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        con.selectPhotoTapped((image) => {
                            con.props.onSend({
                                image:{
                                    type: 'uri',
                                    content: image.uri,
                                },
                                imageData: image.data
                            });
                        });
                    }}
                >
                    <Image
                        style={{width: 26, height: 26, marginBottom: 10, marginLeft: 10}}
                        source={require('../../../media/icons/icon_camera.png')}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

CustomActions.defaultProps = {
    onSend: () => {
    },
};

CustomActions.propTypes = {
    onSend: PropTypes.func,
};

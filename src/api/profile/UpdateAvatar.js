/**
 * Created by minhphan on 8/31/2017.
 */
import RNFetchBlob from 'react-native-fetch-blob';
import config from '../../config/config'

const uploadAvatar = (token, avatar) => (
    RNFetchBlob.fetch('POST', config.host_domain + '/api/authen/users/update-avatar', {
        'Content-Type': 'multipart/form-data',
        Authorization: 'JWT ' + token
    }, [
        {name: 'avatar', filename: 'avatar', type: 'image/jpg', data: avatar},
    ]).then((resp) => resp.json())
        .catch((err) => {
            // ...
        })
);

module.exports = uploadAvatar;
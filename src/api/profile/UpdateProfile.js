/**
 * Created by minhphan on 8/31/2017.
 */
import RNFetchBlob from 'react-native-fetch-blob';
import config from '../../config/config'

const uploadProfile = (token, lastName, firstName, birthday, gender, email) => (
    fetch(config.host_domain + '/api/authen/users/update-profile',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: 'JWT ' + token
            },
            body: JSON.stringify({lastName, firstName, birthday, gender, email})
        })
        .then(response => response.json())
);

module.exports = uploadProfile;
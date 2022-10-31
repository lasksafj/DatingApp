import config from '../../config/config';
const getProfile = (token) => (
    fetch(config.host_domain + '/api/authen/users/get-profile',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'JWT ' + token
            },
        })
        .then(res => res.json())
);
module.exports = getProfile;
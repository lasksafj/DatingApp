import config from '../../config/config';
const getTargetOfUser = (token) => (
    fetch(config.host_domain + '/api/authen/user/getTargetOfUser',
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
module.exports = getTargetOfUser;
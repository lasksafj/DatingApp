import config from '../../config/config';
const getCoupleInfo = (token) => (
    fetch(config.host_domain + '/api/couple/get-setting',
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
module.exports = getCoupleInfo;
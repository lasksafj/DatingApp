import config from '../../config/config';

const RestoreCouple = (token) => (
    fetch(config.host_domain + '/api/couple/restore-couple',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'JWT ' + token
            }
        })
        .then(response => response.json())
        .catch(err => console.log(err))
);

module.exports = RestoreCouple;
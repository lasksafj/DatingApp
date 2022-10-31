import config from '../../config/config';

const checkLogin = (token) => (
        fetch(config.host_domain + '/api/authen/check-login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'JWT ' + token
                },

            })
            .then(response => response.json())
            .catch(err => console.log(err))
    )
;

module.exports = checkLogin;
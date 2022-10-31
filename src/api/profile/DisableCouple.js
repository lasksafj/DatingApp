import config from '../../config/config';

const DisableCouple = (token) => (
        fetch(config.host_domain + '/api/couple/disable-couple',
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
    )
;

module.exports = DisableCouple;
/**
 * Created by minhphan on 7/14/2017.
 */
import config from '../../config/config';
const register = (phone_number, password, firstName, lastName) => (
    fetch(config.host_domain + '/api/authen/register',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({phone_number, password, firstName, lastName})
        })
        .then(response => response.json())
);

module.exports = register;
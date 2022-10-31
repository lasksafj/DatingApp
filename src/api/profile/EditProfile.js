import config from '../../config/config';

const EditProfile = (token, avatar, lastName, firstName, email, birthday, gender) => (
        fetch(config.host_domain + '/api/authen/users/update-profile',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'JWT ' + token
                },
                body: JSON.stringify({avatar, lastName, firstName, email, birthday, gender})
            })
            .then(response => console.log('edit profile', response))
            .catch(err => console.log(err))
    )
;

module.exports = EditProfile;
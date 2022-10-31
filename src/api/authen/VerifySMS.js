/**
 * Created by minhphan on 5/19/2017.
 */
const verifySMS = (request_id, code) => (
    fetch('http://192.168.1.8:3000/api/authen/checkVerifiedCode',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({request_id, code})
        })
        .then(res => res.json())
);
module.exports = verifySMS;
/**
 * Created by minhphan on 5/19/2017.
 */
const requestOtpCode = (phone_number) => (
    fetch('http://192.168.1.8:3000/api/authen/sendVerifyCode',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({phone_number})
        })
        .then(res => res.json())
);
module.exports = requestOtpCode;
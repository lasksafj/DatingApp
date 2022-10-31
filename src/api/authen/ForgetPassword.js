const forgetPassword = (phone_number) => (
    fetch('http:192.168.1.8:3000/api/authen/forget-password',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({phone_number})
        })
        .then(response => response.json())
);
module.exports = forgetPassword;
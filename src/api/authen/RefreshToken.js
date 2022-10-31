/**
 * Created by minhphan on 5/19/2017.
 */

const getNewToken = (token) => (
    fetch('http://192.168.1.8:3000/api/authen/check-login',
        {
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({token})
        })
        .then(response => response.json())
);

const refreshToken = async () => {
    try {
        const token = await getToken();
        if (token === '' || token === "INVALID_TOKEN") {
            console.log("INVALID_TOKEN");
        }
        const newToken = await getNewToken(token);
        await saveToken(newToken);
        console.log('NEW TOKEN: ' + newToken);
    } catch (e) {
        console.log(e);
    }
};

export default refreshToken;
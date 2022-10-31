import config from '../../config/config';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import {
    AccessToken, LoginManager,
    GraphRequest, GraphRequestManager
} from 'react-native-fbsdk';
import AsyncStorageAccess from'../AsyncStorageAccess';

const loginLocal = (phone_number, password) => (
    fetch(config.host_domain + '/api/authen/login',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({phone_number, password})
        })
        .then(response => response.json())
);

const loginWithFacebook = (cb) => {
    LoginManager.logInWithPublishPermissions(['publish_actions'])
        .then((result, error) => {
            if (error) {
                alert("login has error" + error);
            }
            if (result.isCancelled) {
                alert("login is cancelled.");
            } else {
                AccessToken.getCurrentAccessToken().then(
                    (data) => {
                        const accessToken = data.accessToken;
                        console.log('face token', accessToken);
                        AsyncStorageAccess.saveToStorage('@facebookToken', accessToken);
                        const responseInfoCallback = (error, result) => {
                            if (error) {
                            } else {
                                console.log('facebook info', result);
                                accessServer(result.email, result.name, result.id, result.picture.data.url, result.last_name, result.first_name, result.gender, 'login-facebook')
                                    .then(resJSON => cb(undefined, resJSON))
                                    .catch(err => console.log(err));
                            }
                        };
                        const infoRequest = new GraphRequest(
                            '/me',
                            {
                                accessToken: accessToken,
                                parameters: {
                                    fields: {
                                        string: 'birthday,email,name,picture,last_name,first_name,gender'
                                    }
                                }
                            },
                            responseInfoCallback
                        );
                        // Start the graph request.
                        new GraphRequestManager().addRequest(infoRequest).start()
                    }
                )
            }
        })
        .catch(err => console.log(err));
};

const accessServer = (email, displayName, userID, avatar, lastName, firstName, gender, login_url) => (
    fetch(config.host_domain + '/api/authen/' + login_url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({email, displayName, userID, avatar, lastName, firstName, gender})
        })
        .then(response => response.json())
);


const loginWithGoogle = async (cb) => {

    try {
        await GoogleSignin.hasPlayServices({autoResolve: true})
            .then(() => {
                // play services are available. can now configure library
            })
            .catch((err) => {
                console.log("Play services error", err.code, err.message);
            });
        await GoogleSignin.configure({
            webClientId: '507584437998-h5517jgei5n7556rljk0san2q2bo1e63.apps.googleusercontent.com',
        });
        await GoogleSignin.signIn()
            .then((user) => {
                console.log(user);
                accessServer(user.email, user.name, user.id, user.photo, user.familyName, user.givenName, '', 'login-google')
                    .then(resJSON => cb(undefined, resJSON))
                    .catch(err => console.log(err));
            })
            .catch((err) => {
                cb(err, undefined);
            })
            .done();
    } catch (e) {
        cb(e);
    }
};


module.exports = {
    loginLocal,
    loginWithFacebook,
    loginWithGoogle
};
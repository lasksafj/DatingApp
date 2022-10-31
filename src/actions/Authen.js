/**
 * Created by minhphan on 7/14/2017.
 */
import {LOGIN_LOCAL, STORE_USER, STORE_TARGET, STORE_COUPLE_STATUS} from './types';
import {NavigationActions} from 'react-navigation';
import AsyncStorageAccess from '../api/AsyncStorageAccess';
import {LoginManager} from 'react-native-fbsdk';


export const loginSuccess = (user, token, target) => {
    return (dispatch) => {
        AsyncStorageAccess.saveToStorage('@loginToken', token);
        dispatch({
            type: LOGIN_LOCAL,
            target,
            user
        });
        const navigateAction = NavigationActions.navigate({
            routeName: 'AuthenStackNav',
        });
        dispatch(navigateAction);
    }
};

export const storeUser = (user) => {
    return (dispatch) => {
        dispatch({
            type: STORE_USER,
            user
        })
    }
};

export const storeTarget = (target) => {
    return (dispatch) => {
        dispatch({
            type: STORE_TARGET,
            target
        })
    }
};

export const storeCoupleStatus = (couple) => {
    return (dispatch) => {
        dispatch({
            type: STORE_COUPLE_STATUS,
            couple
        })
    }
};

export const logout = () => {
    return (dispatch) => {
        LoginManager.logOut();
        AsyncStorageAccess.saveToStorage('@loginToken', '');
        AsyncStorageAccess.saveToStorage('@user', '');
        const navigateAction = NavigationActions.navigate({
            routeName: 'UnauthenStackNav',
        });
        dispatch(navigateAction);
    }
};
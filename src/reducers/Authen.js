/**
 * Created by minhphan on 7/14/2017.
 */
import {LOGIN_LOCAL, LOGOUT, STORE_USER, STORE_TARGET, STORE_COUPLE_STATUS} from '../actions/types';
const DEFAULT_STATE = {
    loggedIn: false,
    user: null,
    target: null,
    couple: null,
};
export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case LOGIN_LOCAL:
            return {...state, loggedIn: true, user: action.user, target: action.target};
        case STORE_USER:
            return {...state, user: action.user};
        case STORE_TARGET:
            return {...state, target: action.target};
        case STORE_COUPLE_STATUS:
            return {...state, couple: action.couple};
        case LOGOUT:
            return DEFAULT_STATE;
        default:
            return state;
    }
}
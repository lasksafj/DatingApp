import {SOCKET} from '../actions/types';
const DEFAULT_STATE = {
    socket: null
};
export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SOCKET:
            return {socket: action.socket};
        default:
            return state;
    }
}
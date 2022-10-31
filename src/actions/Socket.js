/**
 * Created by minhphan on 8/7/2017.
 */
import {SOCKET} from './types';


export const AccessSocket = (socket) => {
    return (dispatch) => {
        dispatch({
            type: SOCKET,
            socket
        });
    }
};
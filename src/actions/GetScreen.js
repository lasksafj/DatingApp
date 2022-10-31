import {GET_SCREEN} from './types';

export const getScreen = (routeName, prevRouteName, prevScreenTabNav) => {
    return (dispatch) => {
        dispatch({
            type: GET_SCREEN,
            screen: routeName,
            prevScreen: prevRouteName,
            prevScreenTabNav: prevScreenTabNav,
        });
    }
}

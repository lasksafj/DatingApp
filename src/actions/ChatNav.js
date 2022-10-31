import {CHATSCREEN} from './types';
import {NavigationActions} from 'react-navigation';

export const chatScreenNav = (screen) => {
    return (dispatch) => {
        console.log(screen);
        const navigateAction = NavigationActions.navigate({
            routeName: screen,
        });
        dispatch(navigateAction);
    }
};
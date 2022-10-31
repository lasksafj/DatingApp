/**
 * Created by minhphan on 7/14/2017.
 */
import {RootNav} from '../navigation/RootNav';
export default (state, action) => {
    const newState = RootNav.router.getStateForAction(action, state);
    return newState || state;
}

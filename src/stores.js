import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers/';

const store = createStore(reducers, applyMiddleware(thunk));
export default store;
export const dispatch = store.dispatch;
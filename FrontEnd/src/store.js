import {createStore, combineReducers} from 'redux';
import loginReducer from './reducers/loginReducer.js';

const rootReducer = combineReducers({
    loginReducer: loginReducer
})

const configureStore = () => createStore(rootReducer);

export default configureStore;
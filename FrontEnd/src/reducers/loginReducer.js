import {ADD_FIRST_NAME, ADD_LAST_NAME, ADD_EMAIL} from '../actions/types.js';

const initialState = {
    firstName: '',
    lastName: '',
    email: ''
}

const loginReducer = (state=initialState, action) => {
    switch(action.type){
        case ADD_FIRST_NAME:
            return {
                ...state,
                firstName: action.data
            };
        case ADD_LAST_NAME:
            return {
                ...state,
                lastName: action.data
            }
        case ADD_EMAIL:
            return {
                ...state,
                email: action.data
            }
        default:
            return state;
    }
}


export default loginReducer;
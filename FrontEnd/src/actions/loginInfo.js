import {ADD_FIRST_NAME, ADD_LAST_NAME, ADD_EMAIL} from './types.js';

export const addFirstName = (firstName) => (
    {
        type: ADD_FIRST_NAME,
        data: firstName
    }
)

export const addLastName = (lastName) => (
    {
        type: ADD_LAST_NAME,
        data: lastName
    }
)

export const addEmail = (email) => (
    {
        type: ADD_EMAIL,
        data: email
    }
)
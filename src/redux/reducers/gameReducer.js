import { combineReducers } from 'redux';

const gameState = (state = {}, action) => {
    switch (action.type) {
        case 'SET_BOARD':
            return action.payload.data;
        default: return state;
    }
}

const errorMessage = (state = '', action) => {
    switch (action.type) {
        case 'SET_ERROR':
            return action.payload;
        default: return state;
    } 
}

export default combineReducers({
    gameState,
    errorMessage,
});
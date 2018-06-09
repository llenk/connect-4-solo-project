import { combineReducers } from 'redux';

const humanGameState = (state = {}, action) => {
    switch (action.type) {
        case 'SET_BOARD':
            return action.payload.data;
        default: return state;
    }
}

const errorMessageLoad = (state = '', action) => {
    switch (action.type) {
        case 'SET_LOAD_ERROR':
            return action.payload;
        default: return state;
    } 
}

const errorMessageGame = (state = '', action) => {
    switch (action.type) {
        case 'SET_GAME_ERROR':
            return action.payload;
        default: return state;
    }
}

export default combineReducers({
    humanGameState,
    errorMessageLoad,
    errorMessageGame,
});
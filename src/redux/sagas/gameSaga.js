import { put, call, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

const config = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
};

function* humanGameStart(action) {
    try {
        yield call(axios.post, '/api/game/start/human', config);
        yield put({type: 'GET_BOARD'});
    } catch (error) {
        let errorArray = error.message.split(' ');
        let status = parseInt(errorArray[errorArray.length - 1], 10);
        if (status === 409) {
            yield put({type: 'SET_LOAD_ERROR', payload: 'You already have a game in progress. Try navigating to /game'})
        }
    }
}

function* getHumanBoard(action) {
    try {
        let game = yield call(axios.get, 'api/game/human', config);
        yield put({type: 'SET_HUMAN_BOARD', payload: game});
    } catch (error) {
        console.log(error);
    }
}

function* getComputerBoard(action) {
    try {
        let game = yield call(axios.get, 'api/game/computer', config);
        yield put({type: 'SET_COMPUTER_BOARD', payload: game});
    } catch (error) {
        console.log(error);
    }
}

function* placeToken(action) {
    try {
        yield call(axios.put, 'api/game/human', action.payload, config);
        yield put({type: 'SET_GAME_ERROR', payload: ''});
    } catch (error) {
        let errorArray = error.message.split(' ');
        let status = parseInt(errorArray[errorArray.length - 1], 10);
        if (status === 409) {
            yield put({type: 'SET_GAME_ERROR', payload: `You can't put a token in a full column!`});
        }
    }
}

function* placeTokenCG(action) {
    try {
        yield call(axios.put, 'api/game/computer', action.payload, config);
        yield put({type: 'SET_GAME_ERROR', payload: ''});
    } catch (error) {
        let errorArray = error.message.split(' ');
        let status = parseInt(errorArray[errorArray.length - 1], 10);
        if (status === 409) {
            yield put({type: 'SET_GAME_ERROR', payload: `You can't put a token in a full column!`});
        }
    }
    
}

function* removePlayerFromGame(action) {
    try{
        yield call(axios.delete, '/api/game/human', config);
    } catch (error) {
        console.log(error);
    }
}

function* deleteComputerGame(action) {
    try {
        yield call(axios.delete, '/api/game/computer', config);
    } catch (error) {
        console.log(error);
    }
}

function* computerGameStart(action) {
    try {
        yield call(axios.post, '/api/game/computer', config);
        yield put({type: 'GET_COMPUTER_BOARD'});
    } catch (error) {
        let errorArray = error.message.split(' ');
        let status = parseInt(errorArray[errorArray.length - 1], 10);
        if (status === 409) {
            yield put({type: 'SET_LOAD_ERROR', payload: 'You already have a game in progress. Try navigating to /game'})
        }
    }
}

function* gameSaga() {
    yield takeEvery('HUMAN_GAME_START', humanGameStart);
    yield takeEvery('GET_BOARD', getHumanBoard);
    yield takeEvery('PLACE_TOKEN', placeToken);
    yield takeEvery('PLACE_TOKEN_CG', placeTokenCG);
    yield takeEvery('DELETE_GAME', removePlayerFromGame);
    yield takeEvery('COMPUTER_GAME_START', computerGameStart);
    yield takeEvery('GET_COMPUTER_BOARD', getComputerBoard);
    yield takeEvery('DELETE_COMPUTER_GAME', deleteComputerGame);
}

export default gameSaga;
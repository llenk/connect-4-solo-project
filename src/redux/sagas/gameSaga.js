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
        yield put({type: 'SET_BOARD', payload: game});
    } catch (error) {
        console.log(error);
    }
}

function* placeToken(action) {
    try {
        yield call(axios.put, 'api/game/human', action.payload, config);
        yield put({type: 'GET_BOARD'});
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

function* gameSaga() {
    yield takeEvery('HUMAN_GAME_START', humanGameStart);
    yield takeEvery('GET_BOARD', getHumanBoard);
    yield takeEvery('PLACE_TOKEN', placeToken);
    yield takeEvery('DELETE_GAME', removePlayerFromGame);
}

export default gameSaga;
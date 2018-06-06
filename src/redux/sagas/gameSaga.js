import { put, call, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

const config = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
};

function* humanGameStart(action) {
    try {
        yield call(axios.post, '/api/game/start/human', config);
    } catch (error) {
        console.log(error);
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
        yield call(axios.put, 'api/game', action.payload, config);
        yield put({type: 'GET_BOARD'});
    } catch (error) {
        console.log(error);
    }
}

function* gameSaga() {
    yield takeEvery('HUMAN_GAME_START', humanGameStart);
    yield takeEvery('GET_BOARD', getHumanBoard);
    yield takeEvery('PLACE_TOKEN', placeToken);
}

export default gameSaga;
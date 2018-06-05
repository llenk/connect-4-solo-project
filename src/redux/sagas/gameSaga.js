import { put, call, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

function* humanGameStart(action) {
    try {
        yield call(axios.post, '/api/game/start/human');
    } catch (error) {
        console.log(error);
    }
}

function* gameSaga() {
    yield takeEvery('HUMAN_GAME_START', humanGameStart);
}

export default gameSaga;
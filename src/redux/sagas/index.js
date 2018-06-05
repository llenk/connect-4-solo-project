import { all } from 'redux-saga/effects';
import userSaga from './userSaga';
import loginSaga from './loginSaga';
import gameSaga from './gameSaga';

export default function* rootSaga() {
  yield all([
    userSaga(),
    loginSaga(),
    gameSaga(),
    // watchIncrementAsync()
  ]);
}

import { combineReducers } from 'redux';
import user from './userReducer';
import login from './loginReducer';

const store = combineReducers({
  user,
  login,
});

export default store;

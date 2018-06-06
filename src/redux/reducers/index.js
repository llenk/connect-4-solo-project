import { combineReducers } from 'redux';
import user from './userReducer';
import login from './loginReducer';
import game from './gameReducer';

const store = combineReducers({
  user,
  login,
  game,
});

export default store;

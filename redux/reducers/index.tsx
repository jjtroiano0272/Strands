import { combineReducers } from 'redux';
import { user } from './user.tsx';

const Reducers = combineReducers({
  userState: user,
});

export default Reducers;

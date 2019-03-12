'use strict';
import { combineReducers } from 'redux';

import ReducerMnemonic from './ReducerMnemonic';
import ReducerWallets from './ReducerWallets';

const rootReducers = combineReducers({
  ReducerMnemonic,
  ReducerWallets
});

export default rootReducers;

'use strict';
import { combineReducers } from 'redux';

import ReducerMnemonic from './ReducerMnemonic';
import ReducerWallets from './ReducerWallets';
import ReducerTransactions from './ReducerTransactions';

const rootReducers = combineReducers({
  ReducerMnemonic,
  ReducerWallets,
  ReducerTransactions
});

export default rootReducers;

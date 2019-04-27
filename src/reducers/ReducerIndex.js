'use strict';
import { combineReducers } from 'redux';

import ReducerMnemonic from './ReducerMnemonic';
import ReducerWallets from './ReducerWallets';
import ReducerTransactions from './ReducerTransactions';
import ReducerChecksumAddress from './ReducerChecksumAddress';

const rootReducers = combineReducers({
  ReducerMnemonic,
  ReducerWallets,
  ReducerTransactions
  ReducerChecksumAddress
});

export default rootReducers;

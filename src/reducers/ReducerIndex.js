'use strict';
import { combineReducers } from 'redux';

import ReducerMnemonic from './ReducerMnemonic';
import ReducerWallets from './ReducerWallets';
import ReducerTransactions from './ReducerTransactions';
import ReducerChecksumAddress from './ReducerChecksumAddress';
import ReducerGasPrice from './ReducerGasPrice';

const rootReducers = combineReducers({
  ReducerMnemonic,
  ReducerWallets,
  ReducerTransactions
  ReducerChecksumAddress
  ReducerGasPrice
});

export default rootReducers;

'use strict';
import { combineReducers } from 'redux';

import ReducerWeb3 from './ReducerWeb3';
import ReducerMnemonic from './ReducerMnemonic';
import ReducerWallets from './ReducerWallets';
import ReducerTransactionHistory from './ReducerTransactionHistory';
import ReducerChecksumAddress from './ReducerChecksumAddress';
import ReducerGasPrice from './ReducerGasPrice';
import ReducerOutgoingTransactionObject from './ReducerOutgoingTransactionObject';

const rootReducers = combineReducers({
  ReducerWeb3,
  ReducerMnemonic,
  ReducerWallets,
  ReducerTransactionHistory,
  ReducerChecksumAddress,
  ReducerGasPrice,
  ReducerOutgoingTransactionObject
});

export default rootReducers;

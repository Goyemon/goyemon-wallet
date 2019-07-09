'use strict';
import { combineReducers } from 'redux';

import ReducerWeb3 from './ReducerWeb3';
import ReducerMnemonic from './ReducerMnemonic';
import ReducerWallets from './ReducerWallets';
import ReducerTransactions from './ReducerTransactions';
import ReducerChecksumAddress from './ReducerChecksumAddress';
import ReducerGasPrice from './ReducerGasPrice';
import ReducerOutgoingTransactionObject from './ReducerOutgoingTransactionObject';

const rootReducers = combineReducers({
  ReducerWeb3,
  ReducerMnemonic,
  ReducerWallets,
  ReducerTransactions,
  ReducerChecksumAddress,
  ReducerGasPrice,
  ReducerOutgoingTransactionObject
});

export default rootReducers;

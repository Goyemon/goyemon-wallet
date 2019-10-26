'use strict';
import { combineReducers } from 'redux';

import ReducerWeb3 from './ReducerWeb3';
import ReducerMnemonic from './ReducerMnemonic';
import ReducerWallets from './ReducerWallets';
import ReducerPrice from './ReducerPrice';
import ReducerTransactionHistory from './ReducerTransactionHistory';
import ReducerChecksumAddress from './ReducerChecksumAddress';
import ReducerGasPrice from './ReducerGasPrice';
import ReducerOutgoingTransactionObjects from './ReducerOutgoingTransactionObjects';
import ReducerDaiAmount from './ReducerDaiAmount';
import ReducerDaiToAddress from './ReducerDaiToAddress';
import ReducerBalance from './ReducerBalance';
import ReducerNotificationPermission from './ReducerNotificationPermission';

const rootReducers = combineReducers({
  ReducerWeb3,
  ReducerMnemonic,
  ReducerWallets,
  ReducerPrice,
  ReducerTransactionHistory,
  ReducerChecksumAddress,
  ReducerGasPrice,
  ReducerOutgoingTransactionObjects,
  ReducerDaiAmount,
  ReducerDaiToAddress,
  ReducerBalance,
  ReducerNotificationPermission
});

export default rootReducers;

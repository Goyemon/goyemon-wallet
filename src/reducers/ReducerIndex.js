'use strict';
import { combineReducers } from 'redux';
import { CLEAR_STATE } from '../constants/ActionTypes';

import ReducerBalance from './ReducerBalance';
import ReducerChecksumAddress from './ReducerChecksumAddress';
import ReducerDaiAmount from './ReducerDaiAmount';
import ReducerDaiToAddress from './ReducerDaiToAddress';
import ReducerGasPrice from './ReducerGasPrice';
import ReducerMnemonic from './ReducerMnemonic';
import ReducerNotificationPermission from './ReducerNotificationPermission';
import ReducerOutgoingTransactionObjects from './ReducerOutgoingTransactionObjects';
import ReducerPrice from './ReducerPrice';
import ReducerTransactionCount from './ReducerTransactionCount';
import ReducerTransactionFeeEstimate from './ReducerTransactionFeeEstimate';
import ReducerTransactionHistory from './ReducerTransactionHistory';
import ReducerWallets from './ReducerWallets';

const appReducers = combineReducers({
  ReducerBalance,
  ReducerChecksumAddress,
  ReducerDaiAmount,
  ReducerDaiToAddress,
  ReducerGasPrice,
  ReducerMnemonic,
  ReducerNotificationPermission,
  ReducerOutgoingTransactionObjects,
  ReducerPrice,
  ReducerTransactionCount,
  ReducerTransactionFeeEstimate,
  ReducerTransactionHistory,
  ReducerWallets
});

const rootReducers = (state, action) => {
  if (action.type === CLEAR_STATE) {
    state = undefined;
  }
  return appReducers(state, action);
};

export default rootReducers;

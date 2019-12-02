'use strict';
import { combineReducers } from 'redux';
import { CLEAR_STATE } from '../constants/ActionTypes';

import ReducerMnemonic from './ReducerMnemonic';
import ReducerWallets from './ReducerWallets';
import ReducerPrice from './ReducerPrice';
import ReducerTransactionHistory from './ReducerTransactionHistory';
import ReducerChecksumAddress from './ReducerChecksumAddress';
import ReducerGasPrice from './ReducerGasPrice';
import ReducerOutgoingTransactionObjects from './ReducerOutgoingTransactionObjects';
import ReducerTransactionFeeEstimate from './ReducerTransactionFeeEstimate';
import ReducerDaiAmount from './ReducerDaiAmount';
import ReducerDaiToAddress from './ReducerDaiToAddress';
import ReducerBalance from './ReducerBalance';
import ReducerNotificationPermission from './ReducerNotificationPermission';

const appReducers = combineReducers({
  ReducerMnemonic,
  ReducerWallets,
  ReducerPrice,
  ReducerTransactionHistory,
  ReducerChecksumAddress,
  ReducerGasPrice,
  ReducerOutgoingTransactionObjects,
  ReducerTransactionFeeEstimate,
  ReducerDaiAmount,
  ReducerDaiToAddress,
  ReducerBalance,
  ReducerNotificationPermission
});

const rootReducers = (state, action) => {
    if (action.type === CLEAR_STATE) {
        state = undefined;
    }
    return appReducers(state, action);
};

export default rootReducers;

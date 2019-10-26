'use strict';
import { combineReducers } from 'redux';
import { CLEAR_STATE } from '../constants/ActionTypes';

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

const appReducers = combineReducers({
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

const rootReducers = (state, action) => {
    if (action.type === CLEAR_STATE) {
        state = undefined;
    }
    return appReducers(state, action);
};

export default rootReducers;

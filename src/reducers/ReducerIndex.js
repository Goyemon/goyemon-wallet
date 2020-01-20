'use strict';
import { combineReducers } from 'redux';
import { CLEAR_STATE } from '../constants/ActionTypes';

import ReducerBalance from './ReducerBalance';
import ReducerCDaiLendingInfo from './ReducerCDaiLendingInfo';
import ReducerChecksumAddress from './ReducerChecksumAddress';
import ReducerDaiToAddress from './ReducerDaiToAddress';
import ReducerFcmMsgs from './ReducerFcmMsgs';
import ReducerGasPrice from './ReducerGasPrice';
import ReducerMnemonic from './ReducerMnemonic';
import ReducerMnemonicWordsValidation from './ReducerMnemonicWordsValidation';
import ReducerNotificationPermission from './ReducerNotificationPermission';
import ReducerOutgoingDaiTransactionAmount from './ReducerOutgoingDaiTransactionAmount';
import ReducerOutgoingTransactionObjects from './ReducerOutgoingTransactionObjects';
import ReducerPrice from './ReducerPrice';
import ReducerTransactionCount from './ReducerTransactionCount';
import ReducerTransactionFeeEstimate from './ReducerTransactionFeeEstimate';
import ReducerTransactionHistory from './ReducerTransactionHistory';
import ReducerWallets from './ReducerWallets';

const appReducers = combineReducers({
  ReducerBalance,
  ReducerCDaiLendingInfo,
  ReducerChecksumAddress,
  ReducerDaiToAddress,
  ReducerFcmMsgs,
  ReducerGasPrice,
  ReducerMnemonic,
  ReducerMnemonicWordsValidation,
  ReducerNotificationPermission,
  ReducerOutgoingDaiTransactionAmount,
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

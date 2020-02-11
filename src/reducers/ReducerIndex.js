'use strict';
import { combineReducers } from 'redux';
import { CLEAR_STATE } from '../constants/ActionTypes';

import ReducerBalance from './ReducerBalance';
import ReducerCDaiLendingInfo from './ReducerCDaiLendingInfo';
import ReducerChecksumAddress from './ReducerChecksumAddress';
import ReducerFcmMsgs from './ReducerFcmMsgs';
import ReducerDebugInfo from './ReducerDebugInfo';
import ReducerGasPrice from './ReducerGasPrice';
import ReducerMnemonic from './ReducerMnemonic';
import ReducerMnemonicWordsValidation from './ReducerMnemonicWordsValidation';
import ReducerNetInfo from './ReducerNetInfo';
import ReducerNotificationPermission from './ReducerNotificationPermission';
import ReducerQRCodeData from './ReducerQRCodeData';
import ReducerOutgoingDaiTransactionData from './ReducerOutgoingDaiTransactionData';
import ReducerOutgoingTransactionObjects from './ReducerOutgoingTransactionObjects';
import ReducerPrice from './ReducerPrice';
import ReducerTotalTransactions from './ReducerTotalTransactions';
import ReducerTransactionFeeEstimate from './ReducerTransactionFeeEstimate';
import ReducerTransactionHistory from './ReducerTransactionHistory';
import ReducerWallets from './ReducerWallets';

const appReducers = combineReducers({
  ReducerBalance,
  ReducerCDaiLendingInfo,
  ReducerChecksumAddress,
  ReducerFcmMsgs,
  ReducerDebugInfo,
  ReducerGasPrice,
  ReducerMnemonic,
  ReducerMnemonicWordsValidation,
  ReducerNetInfo,
  ReducerQRCodeData,
  ReducerNotificationPermission,
  ReducerOutgoingDaiTransactionData,
  ReducerOutgoingTransactionObjects,
  ReducerPrice,
  ReducerTotalTransactions,
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

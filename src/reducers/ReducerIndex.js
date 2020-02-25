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
import ReducerPermissions from './ReducerPermissions';
import ReducerQRCodeData from './ReducerQRCodeData';
import ReducerOutgoingDaiTransactionData from './ReducerOutgoingDaiTransactionData';
import ReducerOutgoingTransactionObjects from './ReducerOutgoingTransactionObjects';
import ReducerPrice from './ReducerPrice';
import ReducerTotalTransactions from './ReducerTotalTransactions';
import ReducerTransactionFeeEstimate from './ReducerTransactionFeeEstimate';
import ReducerTransactionHistory from './ReducerTransactionHistory';
import ReducerCurrencies from './ReducerCurrencies';

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
  ReducerPermissions,
  ReducerOutgoingDaiTransactionData,
  ReducerOutgoingTransactionObjects,
  ReducerPrice,
  ReducerTotalTransactions,
  ReducerTransactionFeeEstimate,
  ReducerTransactionHistory,
  ReducerCurrencies
});

const rootReducers = (state, action) => {
  if (action.type === CLEAR_STATE) {
    state = undefined;
  }
  return appReducers(state, action);
};

export default rootReducers;

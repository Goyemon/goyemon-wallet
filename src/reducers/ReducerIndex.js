'use strict';
import { combineReducers } from 'redux';
import { CLEAR_STATE } from '../constants/ActionTypes';

import ReducerBalance from './ReducerBalance';
import ReducerCDaiLendingInfo from './ReducerCDaiLendingInfo';
import ReducerChecksumAddress from './ReducerChecksumAddress';
import ReducerFcmMsgs from './ReducerFcmMsgs';
import ReducerDebugInfo from './ReducerDebugInfo';
import ReducerExchangeReserve from './ReducerExchangeReserve';
import ReducerGasPrice from './ReducerGasPrice';
import ReducerEarnModalVisibility from './ReducerEarnModalVisibility';
import ReducerMnemonic from './ReducerMnemonic';
import ReducerMnemonicWordsValidation from './ReducerMnemonicWordsValidation';
import ReducerNetInfo from './ReducerNetInfo';
import ReducerPermissions from './ReducerPermissions';
import ReducerQRCodeData from './ReducerQRCodeData';
import ReducerOutgoingTransactionData from './ReducerOutgoingTransactionData';
import ReducerOutgoingTransactionObjects from './ReducerOutgoingTransactionObjects';
import ReducerPrice from './ReducerPrice';
import ReducerRehydration from './ReducerRehydration';
import ReducerTransactionsLoaded from './ReducerTransactionsLoaded';
import ReducerTransactionHistory from './ReducerTransactionHistory';
import ReducerCurrencies from './ReducerCurrencies';

const appReducers = combineReducers({
  ReducerBalance,
  ReducerCDaiLendingInfo,
  ReducerChecksumAddress,
  ReducerFcmMsgs,
  ReducerDebugInfo,
  ReducerEarnModalVisibility,
  ReducerExchangeReserve,
  ReducerGasPrice,
  ReducerMnemonic,
  ReducerMnemonicWordsValidation,
  ReducerNetInfo,
  ReducerQRCodeData,
  ReducerPermissions,
  ReducerOutgoingTransactionData,
  ReducerOutgoingTransactionObjects,
  ReducerPrice,
  ReducerRehydration,
  ReducerTransactionsLoaded,
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

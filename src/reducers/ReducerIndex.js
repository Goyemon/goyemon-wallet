'use strict';
import { combineReducers } from 'redux';
import { CLEAR_STATE } from '../constants/ActionTypes';

import ReducerApproval from './ReducerApproval';
import ReducerBalance from './ReducerBalance';
import ReducerCompound from './ReducerCompound';
import ReducerChecksumAddress from './ReducerChecksumAddress';
import ReducerFcmMsgs from './ReducerFcmMsgs';
import ReducerDebugInfo from './ReducerDebugInfo';
import ReducerGasPrice from './ReducerGasPrice';
import ReducerMnemonic from './ReducerMnemonic';
import ReducerMnemonicWordsValidation from './ReducerMnemonicWordsValidation';
import ReducerNetInfo from './ReducerNetInfo';
import ReducerPermissions from './ReducerPermissions';
import ReducerQRCodeData from './ReducerQRCodeData';
import ReducerOutgoingTransactionData from './ReducerOutgoingTransactionData';
import ReducerPoolTogether from './ReducerPoolTogether';
import ReducerPrice from './ReducerPrice';
import ReducerRehydration from './ReducerRehydration';
import ReducerModal from './ReducerModal';
import ReducerTransactionsLoaded from './ReducerTransactionsLoaded';
import ReducerTransactionHistory from './ReducerTransactionHistory';
import ReducerTxFormValidation from './ReducerTxFormValidation';
import ReducerUniswap from './ReducerUniswap';

const appReducers = combineReducers({
  ReducerApproval,
  ReducerBalance,
  ReducerCompound,
  ReducerChecksumAddress,
  ReducerFcmMsgs,
  ReducerDebugInfo,
  ReducerGasPrice,
  ReducerMnemonic,
  ReducerMnemonicWordsValidation,
  ReducerModal,
  ReducerNetInfo,
  ReducerQRCodeData,
  ReducerPermissions,
  ReducerPoolTogether,
  ReducerOutgoingTransactionData,
  ReducerPrice,
  ReducerRehydration,
  ReducerTransactionsLoaded,
  ReducerTransactionHistory,
  ReducerTxFormValidation,
  ReducerUniswap,
});

const rootReducers = (state, action) => {
  if (action.type === CLEAR_STATE) {
    state = undefined;
  }
  return appReducers(state, action);
};

export default rootReducers;

'use strict';
import { combineReducers } from 'redux';
import { CLEAR_STATE } from '../constants/ActionTypes';

import ReducerApproval from './ReducerApproval';
import ReducerBalance from './ReducerBalance';
import ReducerCompound from './ReducerCompound';
import ReducerChecksumAddress from './ReducerChecksumAddress';
import ReducerFcmMsgs from './ReducerFcmMsgs';
import ReducerDebugInfo from './ReducerDebugInfo';
import ReducerUniswap from './ReducerUniswap';
import ReducerGasPrice from './ReducerGasPrice';
import ReducerMnemonic from './ReducerMnemonic';
import ReducerMnemonicWordsValidation from './ReducerMnemonicWordsValidation';
import ReducerNetInfo from './ReducerNetInfo';
import ReducerPermissions from './ReducerPermissions';
import ReducerQRCodeData from './ReducerQRCodeData';
import ReducerOutgoingTransactionData from './ReducerOutgoingTransactionData';
import ReducerOutgoingTransactionObjects from './ReducerOutgoingTransactionObjects';
import ReducerPoolTogether from './ReducerPoolTogether';
import ReducerPrice from './ReducerPrice';
import ReducerRehydration from './ReducerRehydration';
import ReducerTxConfirmationModal from './ReducerTxConfirmationModal';
import ReducerTransactionsLoaded from './ReducerTransactionsLoaded';
import ReducerTransactionHistory from './ReducerTransactionHistory';

const appReducers = combineReducers({
  ReducerApproval,
  ReducerBalance,
  ReducerCompound,
  ReducerChecksumAddress,
  ReducerFcmMsgs,
  ReducerDebugInfo,
  ReducerUniswap,
  ReducerGasPrice,
  ReducerMnemonic,
  ReducerMnemonicWordsValidation,
  ReducerNetInfo,
  ReducerQRCodeData,
  ReducerPermissions,
  ReducerPoolTogether,
  ReducerOutgoingTransactionData,
  ReducerOutgoingTransactionObjects,
  ReducerPrice,
  ReducerRehydration,
  ReducerTxConfirmationModal,
  ReducerTransactionsLoaded,
  ReducerTransactionHistory
});

const rootReducers = (state, action) => {
  if (action.type === CLEAR_STATE) {
    state = undefined;
  }
  return appReducers(state, action);
};

export default rootReducers;

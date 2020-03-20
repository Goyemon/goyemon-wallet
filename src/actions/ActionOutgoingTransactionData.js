'use strict';
import { SAVE_OUTGOING_TRANSACTION_DATA_SEND } from '../constants/ActionTypes';
import { SAVE_OUTGOING_TRANSACTION_DATA_COMPOUND } from '../constants/ActionTypes';
import { SAVE_OUTGOING_TRANSACTION_DATA_SWAP } from '../constants/ActionTypes';
import { SAVE_OUTGOING_TRANSACTION_DATA_SWAP_SLIPPAGE } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveOutgoingTransactionDataSend(sendData) {
  return async function(dispatch) {
    try {
      dispatch(saveOutgoingTransactionDataSendSuccess(sendData));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveOutgoingTransactionDataSendSuccess = sendData => ({
  type: SAVE_OUTGOING_TRANSACTION_DATA_SEND,
  payload: sendData
});

export function saveOutgoingTransactionDataCompound(compoundData) {
  return async function(dispatch) {
    try {
      dispatch(saveOutgoingTransactionDataCompoundSuccess(compoundData));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveOutgoingTransactionDataCompoundSuccess = compoundData => ({
  type: SAVE_OUTGOING_TRANSACTION_DATA_COMPOUND,
  payload: compoundData
});

export function saveOutgoingTransactionDataSwap(swapData) {
  return async function(dispatch) {
    try {
      dispatch(saveOutgoingTransactionDataSwapSuccess(swapData));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveOutgoingTransactionDataSwapSuccess = swapData => ({
  type: SAVE_OUTGOING_TRANSACTION_DATA_SWAP,
  payload: swapData
});

export function saveOutgoingTransactionDataSwapSlippage(slippage) {
  return async function(dispatch) {
    try {
      dispatch(saveOutgoingTransactionDataSwapSlippageSuccess(slippage));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveOutgoingTransactionDataSwapSlippageSuccess = slippage => ({
  type: SAVE_OUTGOING_TRANSACTION_DATA_SWAP_SLIPPAGE,
  payload: slippage
});

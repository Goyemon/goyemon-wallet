'use strict';
import {
  SAVE_OUTGOING_TRANSACTION_DATA_SEND,
  SAVE_OUTGOING_TRANSACTION_DATA_COMPOUND,
  SAVE_OUTGOING_TRANSACTION_DATA_POOLTOGETHER,
  SAVE_OUTGOING_TRANSACTION_DATA_SWAP
} from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveOutgoingTransactionDataSend(sendData: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveOutgoingTransactionDataSendSuccess(sendData));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveOutgoingTransactionDataSendSuccess = (sendData: any) => ({
  type: SAVE_OUTGOING_TRANSACTION_DATA_SEND,
  payload: sendData
});

export function saveOutgoingTransactionDataCompound(compoundData: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveOutgoingTransactionDataCompoundSuccess(compoundData));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveOutgoingTransactionDataCompoundSuccess = (compoundData: any) => ({
  type: SAVE_OUTGOING_TRANSACTION_DATA_COMPOUND,
  payload: compoundData
});

export function saveOutgoingTransactionDataPoolTogether(poolTogether: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveOutgoingTransactionDataPoolTogetherSuccess(poolTogether));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveOutgoingTransactionDataPoolTogetherSuccess = (poolTogether: any) => ({
  type: SAVE_OUTGOING_TRANSACTION_DATA_POOLTOGETHER,
  payload: poolTogether
});

export function saveOutgoingTransactionDataSwap(swapData: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveOutgoingTransactionDataSwapSuccess(swapData));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveOutgoingTransactionDataSwapSuccess = (swapData: any) => ({
  type: SAVE_OUTGOING_TRANSACTION_DATA_SWAP,
  payload: swapData
});

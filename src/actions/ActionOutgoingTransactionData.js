'use strict';
import { SAVE_OUTGOING_TRANSACTION_DATA_AMOUNT } from '../constants/ActionTypes';
import { SAVE_OUTGOING_TRANSACTION_DATA_TOADDRESS } from '../constants/ActionTypes';
import { SAVE_OUTGOING_TRANSACTION_DATA_APPROVE_AMOUNT } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveOutgoingTransactionDataAmount(amount) {
  return async function(dispatch) {
    try {
      LogUtilities.logInfo(`${amount} saved`);
      dispatch(saveOutgoingTransactionDataAmountSuccess(amount));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveOutgoingTransactionDataAmountSuccess = amount => ({
  type: SAVE_OUTGOING_TRANSACTION_DATA_AMOUNT,
  payload: amount
});

export function saveOutgoingTransactionDataToaddress(toaddress) {
  return async function(dispatch) {
    try {
      dispatch(saveOutgoingTransactionDataToaddressSuccess(toaddress));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveOutgoingTransactionDataToaddressSuccess = toaddress => ({
  type: SAVE_OUTGOING_TRANSACTION_DATA_TOADDRESS,
  payload: toaddress
});

export function saveOutgoingTransactionDataApproveAmount(approveAmount) {
  return async function(dispatch) {
    try {
      dispatch(saveOutgoingTransactionDataApproveAmountSuccess(approveAmount));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveOutgoingTransactionDataApproveAmountSuccess = approveAmount => ({
  type: SAVE_OUTGOING_TRANSACTION_DATA_APPROVE_AMOUNT,
  payload: approveAmount
});

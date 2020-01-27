'use strict';
import { SAVE_OUTGOING_DAI_TRANSACTION_AMOUNT } from '../constants/ActionTypes';
import { SAVE_OUTGOING_DAI_TRANSACTION_TO_ADDRESS } from '../constants/ActionTypes';
import { SAVE_OUTGOING_DAI_TRANSACTION_APPROVE_AMOUNT } from '../constants/ActionTypes';

export function saveOutgoingDaiTransactionAmount(daiAmount) {
  return async function (dispatch) {
    try {
      dispatch(saveOutgoingDaiTransactionAmountSuccess(daiAmount));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveOutgoingDaiTransactionAmountSuccess = (daiAmount) => ({
  type: SAVE_OUTGOING_DAI_TRANSACTION_AMOUNT,
  payload: daiAmount
})

export function saveOutgoingDaiTransactionToAddress(toAddress) {
  return async function (dispatch) {
    try {
      dispatch(saveOutgoingDaiTransactionToAddressSuccess(toAddress));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveOutgoingDaiTransactionToAddressSuccess = (toAddress) => ({
  type: SAVE_OUTGOING_DAI_TRANSACTION_TO_ADDRESS,
  payload: toAddress
})

export function saveOutgoingDaiTransactionApproveAmount(approveAmount) {
  return async function (dispatch) {
    try {
      dispatch(saveOutgoingDaiTransactionApproveAmountSuccess(approveAmount));
    } catch(err) {
      console.error(err);
    }
  }
};

const saveOutgoingDaiTransactionApproveAmountSuccess = (approveAmount) => ({
  type: SAVE_OUTGOING_DAI_TRANSACTION_APPROVE_AMOUNT,
  payload: approveAmount
})

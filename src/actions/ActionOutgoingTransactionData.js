'use strict';
import { SAVE_OUTGOING_TRANSACTION_DATA_COMPOUND } from '../constants/ActionTypes';
import { SAVE_OUTGOING_TRANSACTION_DATA_POOLTOGETHER } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveOutgoingTransactionDataCompound(compoundData) {
  return async function (dispatch) {
    try {
      dispatch(saveOutgoingTransactionDataCompoundSuccess(compoundData));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveOutgoingTransactionDataCompoundSuccess = (compoundData) => ({
  type: SAVE_OUTGOING_TRANSACTION_DATA_COMPOUND,
  payload: compoundData
});

export function saveOutgoingTransactionDataPoolTogether(poolTogether) {
  return async function (dispatch) {
    try {
      dispatch(saveOutgoingTransactionDataPoolTogetherSuccess(poolTogether));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveOutgoingTransactionDataPoolTogetherSuccess = (poolTogether) => ({
  type: SAVE_OUTGOING_TRANSACTION_DATA_POOLTOGETHER,
  payload: poolTogether
});

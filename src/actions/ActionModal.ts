'use strict';
import {
  SAVE_TX_DETAIL_MODAL_VISIBILITY,
  SAVE_TX_CONFIRMATION_MODAL_VISIBILITY,
  UPDATE_TX_CONFIRMATION_MODAL_VISIBLE_TYPE,
  SAVE_POP_UP_MODAL_VISIBILITY,
  BUY_CRYPTO_MODAL_VISIBILITY
} from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities';

export function saveTxDetailModalVisibility(visibility: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveTxDetailModalVisibilitySuccess(visibility));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveTxDetailModalVisibilitySuccess = (visibility: any) => ({
  type: SAVE_TX_DETAIL_MODAL_VISIBILITY,
  payload: visibility
});

export function saveTxConfirmationModalVisibility(visibility: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveTxConfirmationModalVisibilitySuccess(visibility));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveTxConfirmationModalVisibilitySuccess = (visibility: any) => ({
  type: SAVE_TX_CONFIRMATION_MODAL_VISIBILITY,
  payload: visibility
});

export function updateTxConfirmationModalVisibleType(type: any) {
  return async function (dispatch: any) {
    try {
      dispatch(updateTxConfirmationModalVisibleTypeSuccess(type));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const updateTxConfirmationModalVisibleTypeSuccess = (type: any) => ({
  type: UPDATE_TX_CONFIRMATION_MODAL_VISIBLE_TYPE,
  payload: type
});

export function savePopUpModalVisibility(visibility: any) {
  return async function (dispatch: any) {
    try {
      dispatch(savePopUpModalVisibilitySuccess(visibility));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const savePopUpModalVisibilitySuccess = (visibility: any) => ({
  type: SAVE_POP_UP_MODAL_VISIBILITY,
  payload: visibility
});

export function saveBuyCryptoModalVisibility(visibility: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveBuyCryptoModalVisibilitySuccess(visibility));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveBuyCryptoModalVisibilitySuccess = (visibility: any) => ({
  type: BUY_CRYPTO_MODAL_VISIBILITY,
  payload: visibility
});

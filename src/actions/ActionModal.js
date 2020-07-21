'use strict';
import {
  SAVE_TX_DETAIL_MODAL_VISIBILITY,
  SAVE_TX_CONFIRMATION_MODAL_VISIBILITY,
  UPDATE_TX_CONFIRMATION_MODAL_VISIBLE_TYPE,
  SAVE_POP_UP_MODAL_VISIBILITY
} from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveTxDetailModalVisibility(visibility) {
  return async function (dispatch) {
    try {
      dispatch(saveTxDetailModalVisibilitySuccess(visibility));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveTxDetailModalVisibilitySuccess = (visibility) => ({
  type: SAVE_TX_DETAIL_MODAL_VISIBILITY,
  payload: visibility
});

export function saveTxConfirmationModalVisibility(visibility) {
  return async function (dispatch) {
    try {
      dispatch(saveTxConfirmationModalVisibilitySuccess(visibility));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveTxConfirmationModalVisibilitySuccess = (visibility) => ({
  type: SAVE_TX_CONFIRMATION_MODAL_VISIBILITY,
  payload: visibility
});

export function updateTxConfirmationModalVisibleType(type) {
  return async function (dispatch) {
    try {
      dispatch(updateTxConfirmationModalVisibleTypeSuccess(type));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const updateTxConfirmationModalVisibleTypeSuccess = (type) => ({
  type: UPDATE_TX_CONFIRMATION_MODAL_VISIBLE_TYPE,
  payload: type
});

export function savePopUpModalVisibility(visibility) {
  return async function (dispatch) {
    try {
      dispatch(savePopUpModalVisibilitySuccess(visibility));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const savePopUpModalVisibilitySuccess = (visibility) => ({
  type: SAVE_POP_UP_MODAL_VISIBILITY,
  payload: visibility
});

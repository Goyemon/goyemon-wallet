'use strict';
import {
  SAVE_TX_CONFIRMATION_MODAL_VISIBILITY,
  UPDATE_VISIBLE_TYPE
} from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

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

export function updateVisibleType(type) {
  return async function (dispatch) {
    try {
      dispatch(updateVisibleTypeSuccess(type));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const updateVisibleTypeSuccess = (type) => ({
  type: UPDATE_VISIBLE_TYPE,
  payload: type
});

'use strict';
import { SAVE_EARN_MODAL_VISIBILITY } from '../constants/ActionTypes';
import { UPDATE_VISIBLE_TYPE } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function saveEarnModalVisibility(visibility) {
  return async function(dispatch) {
    try {
      dispatch(saveEarnModalVisibilitySuccess(visibility));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveEarnModalVisibilitySuccess = visibility => ({
  type: SAVE_EARN_MODAL_VISIBILITY,
  payload: visibility
});

export function updateVisibleType(type) {
    return async function(dispatch) {
      try {
        dispatch(updateVisibleTypeSuccess(type));
      } catch (err) {
        LogUtilities.logError(err);
      }
    };
  }
  
  const updateVisibleTypeSuccess = type => ({
    type: UPDATE_VISIBLE_TYPE,
    payload: type
  });
  
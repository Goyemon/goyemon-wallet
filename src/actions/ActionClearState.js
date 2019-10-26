'use strict';
import { CLEAR_STATE } from '../constants/ActionTypes';

export function clearState() {
  return async function (dispatch) {
    try {
      dispatch(clearStateSuccess());
    } catch(err) {
      console.error(err);
    }
  }
};

const clearStateSuccess = () => ({
  type: CLEAR_STATE
})

'use strict';
import { REHYDRATION_COMPLETE } from '../constants/ActionTypes';

const INITIAL_STATE = {
  rehydration: false,
};

const rehydration = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REHYDRATION_COMPLETE:
      return { ...state, rehydration: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default rehydration;

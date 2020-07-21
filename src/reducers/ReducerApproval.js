'use strict';
import {
  SAVE_DAI_COMPOUND_APPROVAL,
  SAVE_DAI_POOLTOGETHER_APPROVAL
} from '../constants/ActionTypes';

const INITIAL_STATE = {
  approval: {
    dai: {
      compound: null,
      pooltogether: null
    }
  }
};

const approval = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_DAI_COMPOUND_APPROVAL:
      return {
        approval: {
          dai: {
            ...state.approval.dai,
            compound: action.payload
          }
        }
      };
    case SAVE_DAI_POOLTOGETHER_APPROVAL:
      return {
        approval: {
          dai: {
            ...state.approval.dai,
            pooltogether: action.payload
          }
        }
      };

    default:
      return state || INITIAL_STATE;
  }
};

export default approval;

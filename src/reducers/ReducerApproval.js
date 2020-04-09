'use strict';
import { SAVE_DAI_COMPOUND_APPROVAL} from '../constants/ActionTypes';

const INITIAL_STATE = {
  approval: {
    dai: {
      compound: null
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
    default:
      return state || INITIAL_STATE;
  }
};

export default approval;

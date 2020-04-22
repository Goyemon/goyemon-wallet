'use strict';
import {
  SAVE_TX_CONFIRMATION_MODAL_VISIBILITY,
  UPDATE_VISIBLE_TYPE
} from '../constants/ActionTypes';

const INITIAL_STATE = {
  txConfirmationModal: {
    visibility: false,
    type: null
  }
};

const txConfirmationModal = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_TX_CONFIRMATION_MODAL_VISIBILITY:
      return {
        txConfirmationModal: {
          ...state.txConfirmationModal,
          visibility: action.payload
        }
      };
    case UPDATE_VISIBLE_TYPE:
      return {
        txConfirmationModal: {
          ...state.txConfirmationModal,
          type: action.payload
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default txConfirmationModal;

'use strict';
import {
  SAVE_TX_CONFIRMATION_MODAL_VISIBILITY,
  UPDATE_TX_CONFIRMATION_MODAL_VISIBLE_TYPE,
  SAVE_POP_UP_MODAL_VISIBILITY
} from '../constants/ActionTypes';

const INITIAL_STATE = {
  modal: {
    txConfirmationModalVisibility: false,
    txConfirmationModalType: null,
    popUpModalVisibility: false
  }
};

const modal = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_TX_CONFIRMATION_MODAL_VISIBILITY:
      return {
        modal: {
          ...state.modal,
          txConfirmationModalVisibility: action.payload
        }
      };
    case UPDATE_TX_CONFIRMATION_MODAL_VISIBLE_TYPE:
      return {
        modal: {
          ...state.modal,
          txConfirmationModalType: action.payload
        }
      };
    case SAVE_POP_UP_MODAL_VISIBILITY:
      return {
        modal: {
          ...state.modal,
          popUpModalVisibility: action.payload
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default modal;
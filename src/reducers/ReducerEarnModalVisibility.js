'use strict';
import { SAVE_EARN_MODAL_VISIBILITY } from '../constants/ActionTypes';
import { UPDATE_VISIBLE_TYPE } from '../constants/ActionTypes';

const INITIAL_STATE = {
  earnModal: {
    visibility: false,
    type: null
  }
};

const earnModal = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_EARN_MODAL_VISIBILITY:
      return { earnModal: { ...state.earnModal, visibility: action.payload } };
    case UPDATE_VISIBLE_TYPE:
      return { earnModal: { ...state.earnModal, type: action.payload } };
    default:
      return state || INITIAL_STATE;
  }
};

export default earnModal;

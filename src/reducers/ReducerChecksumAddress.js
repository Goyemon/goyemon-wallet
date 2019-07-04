'use strict';
import { GET_CHECKSUM_ADDRESS } from '../constants/ActionTypes';

const INITIAL_STATE = {
  checksumAddress: ''
};

const checksumAddress = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CHECKSUM_ADDRESS:
      return { ...state, checksumAddress: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default checksumAddress;

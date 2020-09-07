"use strict";
import { CREATE_CHECKSUM_ADDRESS } from "../constants/ActionTypes";

const INITIAL_STATE = {
  checksumAddress: null
};

const checksumAddress = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case CREATE_CHECKSUM_ADDRESS:
      return { ...state, checksumAddress: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default checksumAddress;

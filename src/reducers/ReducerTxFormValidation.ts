'use strict';
import { UPDATE_TOADDRESS_VALIDATION } from '../constants/ActionTypes';

const INITIAL_STATE = {
  toAddressValidation: undefined
};

const toAddressValidation = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case UPDATE_TOADDRESS_VALIDATION:
      return { ...state, toAddressValidation: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default toAddressValidation;

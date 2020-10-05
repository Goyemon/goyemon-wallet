"use strict";
import { SAVE_COMPOUND_DAI_INFO } from "../constants/ActionTypes";

const INITIAL_STATE = {
  compound: {
    dai: {
      currentExchangeRate: "",
      currentInterestRate: "",
      lifetimeEarned: ""
    }
  }
};

const compound = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SAVE_COMPOUND_DAI_INFO:
      return {
        compound: {
          dai: {
            ...state.compound.dai,
            currentExchangeRate: action.payload.exchangeRate,
            currentInterestRate: action.payload.supplyRate,
            lifetimeEarned: action.payload.lifetimeSupply
          }
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default compound;

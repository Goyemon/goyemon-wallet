'use strict';
import { SAVE_TRANSACTION_FEE_ESTIMATE_USD } from '../constants/ActionTypes';
import { SAVE_TRANSACTION_FEE_ESTIMATE_ETH } from '../constants/ActionTypes';

const INITIAL_STATE = {
  transactionFeeEstimate: {
    usd: '',
    eth: ''
  }
};

const transactionFeeEstimate = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_TRANSACTION_FEE_ESTIMATE_USD:
      return { transactionFeeEstimate: { ...state.transactionFeeEstimate, usd: action.payload } };
    case SAVE_TRANSACTION_FEE_ESTIMATE_ETH:
      return { transactionFeeEstimate: { ...state.transactionFeeEstimate, eth: action.payload } };
    default:
      return state || INITIAL_STATE;
  }
};

export default transactionFeeEstimate;

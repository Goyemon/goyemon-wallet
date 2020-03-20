'use strict';
import Web3 from 'web3';
import {
  GET_GAS_PRICE,
  UPDATE_GAS_PRICE_CHOSEN
} from '../constants/ActionTypes';

const INITIAL_STATE = {
  gasPrice: {
    fast: 0,
    average: 0,
    slow: 0,
    chosen: 1
  }
};

const gasPrice = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_GAS_PRICE:
      const gasPriceFastGwei = (action.payload.fast / 10).toString();
      const gasPriceFastWei = Web3.utils.toWei(gasPriceFastGwei, 'Gwei');
      const gasPriceAverageGwei = (action.payload.average / 10).toString();
      const gasPriceAverageWei = Web3.utils.toWei(gasPriceAverageGwei, 'Gwei');
      const gasPriceSlowGwei = (action.payload.safeLow / 10).toString();
      const gasPriceSlowWei = Web3.utils.toWei(gasPriceSlowGwei, 'Gwei');

      return {
        gasPrice: {
          ...state.gasPrice,
          fast: gasPriceFastWei,
          average: gasPriceAverageWei,
          slow: gasPriceSlowWei
        }
      };
    case UPDATE_GAS_PRICE_CHOSEN:
      return { gasPrice: { ...state.gasPrice, chosen: action.payload } };
    default:
      return state || INITIAL_STATE;
  }
};

export default gasPrice;

'use strict';
import Web3 from 'web3';
import {
  GET_GAS_PRICE,
  UPDATE_GAS_PRICE_CHOSEN
} from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

const INITIAL_STATE = {
  gasPrice: [
    {
      speed: 'fast',
      value: 0
    },
    {
      speed: 'average',
      value: 0
    },
    {
      speed: 'slow',
      value: 0
    }
  ],
  gasChosen: 1
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
        gasPrice: state.gasPrice.map((gasPrice) => {
          if (gasPrice.speed === 'fast') {
            return { speed: 'fast', value: gasPriceFastWei };
          } else if (gasPrice.speed === 'average') {
            return { speed: 'average', value: gasPriceAverageWei };
          } else if (gasPrice.speed === 'slow') {
            return { speed: 'slow', value: gasPriceSlowWei };
          } else {
            LogUtilities.logInfo('no gas speed matches');
          }
        }),
        gasChosen: state.gasChosen
      };
    case UPDATE_GAS_PRICE_CHOSEN:
      return { ...state, gasChosen: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default gasPrice;

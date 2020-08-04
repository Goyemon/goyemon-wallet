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
      speed: 'super fast',
      value: 0
    },
    {
      speed: 'fast',
      value: 0
    },
    {
      speed: 'normal',
      value: 0
    }
  ],
  gasChosen: 1
};

const gasPrice = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_GAS_PRICE: {
      const gasPriceSuperFastGwei = (action.payload.fast / 10).toString();
      const gasPriceSuperFastWei = Web3.utils.toWei(
        gasPriceSuperFastGwei,
        'Gwei'
      );
      const gasPriceFastGwei = (action.payload.average / 10).toString();
      const gasPriceFastWei = Web3.utils.toWei(gasPriceFastGwei, 'Gwei');
      const gasPriceNormalGwei = (action.payload.safeLow / 10).toString();
      const gasPriceNormalWei = Web3.utils.toWei(gasPriceNormalGwei, 'Gwei');

      return {
        gasPrice: state.gasPrice.map((gasPrice) => {
          if (gasPrice.speed === 'super fast') {
            return { speed: 'super fast', value: gasPriceSuperFastWei };
          } else if (gasPrice.speed === 'fast') {
            return { speed: 'fast', value: gasPriceFastWei };
          } else if (gasPrice.speed === 'normal') {
            return { speed: 'normal', value: gasPriceNormalWei };
          } else {
            LogUtilities.logInfo('no gas speed matches');
          }
        }),
        gasChosen: state.gasChosen
      };
    }
    case UPDATE_GAS_PRICE_CHOSEN:
      return { ...state, gasChosen: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default gasPrice;

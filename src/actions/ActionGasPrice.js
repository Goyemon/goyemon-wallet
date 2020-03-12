'use strict';
import axios from 'axios';
import Web3 from 'web3';
import {
  GET_GAS_PRICE,
  UPDATE_GAS_PRICE_CHOSEN
} from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function getGasPrice() {
  return async function(dispatch) {
    try {
      const gasPrice = await axios.get(
        'https://ethgasstation.info/json/ethgasAPI.json'
      );
      dispatch(getGasPriceSuccess(gasPrice.data));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const getGasPriceSuccess = gasPrice => ({
  type: GET_GAS_PRICE,
  payload: gasPrice
});

export function updateGasPriceChosen(key) {
  return async function(dispatch) {
    try {
      dispatch(updateGasPriceChosenSuccess(key));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const updateGasPriceChosenSuccess = key => ({
  type: UPDATE_GAS_PRICE_CHOSEN,
  payload: key
});

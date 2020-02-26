'use strict';
import axios from 'axios';
import Web3 from 'web3';
import { GET_GAS_PRICE_FAST, GET_GAS_PRICE_AVERAGE, GET_GAS_PRICE_SLOW } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function getGasPriceFast() {
  return async function (dispatch) {
    try {
      const gasPrice = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
      const gasPriceFastGwei =  (gasPrice.data.fast/10).toString();
      const gasPriceFastWei = Web3.utils.toWei(gasPriceFastGwei, 'Gwei');
      dispatch(getGasPriceFastSuccess(gasPriceFastWei));
    } catch(err) {
      LogUtilities.logError(err);
    }
  }
};

const getGasPriceFastSuccess = (gasPriceFastWei) => ({
  type: GET_GAS_PRICE_FAST,
  payload: gasPriceFastWei
})

export function getGasPriceAverage() {
  return async function (dispatch) {
    try {
      const gasPrice = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
      const gasPriceAverageGwei =  (gasPrice.data.average/10).toString();
      const gasPriceAverageWei = Web3.utils.toWei(gasPriceAverageGwei, 'Gwei');
      dispatch(getGasPriceAverageSuccess(gasPriceAverageWei));
    } catch(err) {
      LogUtilities.logError(err);
    }
  }
};

const getGasPriceAverageSuccess = (gasPriceAverageWei) => ({
  type: GET_GAS_PRICE_AVERAGE,
  payload: gasPriceAverageWei
})

export function getGasPriceSlow() {
  return async function (dispatch) {
    try {
      const gasPrice = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
      const gasPriceSlowGwei =  (gasPrice.data.safeLow/10).toString();
      const gasPriceSlowWei = Web3.utils.toWei(gasPriceSlowGwei, 'Gwei');
      dispatch(getGasPriceSlowSuccess(gasPriceSlowWei));
    } catch(err) {
      LogUtilities.logError(err);
    }
  }
};

const getGasPriceSlowSuccess = (gasPriceSlowWei) => ({
  type: GET_GAS_PRICE_SLOW,
  payload: gasPriceSlowWei
});

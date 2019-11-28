'use strict';
import { GET_GAS_PRICE_FAST, GET_GAS_PRICE_AVERAGE, GET_GAS_PRICE_SLOW } from '../constants/ActionTypes';
import axios from 'axios';
import ProviderUtilities from '../utilities/ProviderUtilities.ts';

const WEB3 = ProviderUtilities.setProvider();

export function getGasPriceFast() {
  return async function (dispatch) {
    try {
      const gasPrice = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
      const gasPriceFastInGwei =  (gasPrice.data.fast/10).toString();
      const gasPriceFastInWei = WEB3.utils.toWei(gasPriceFastInGwei, 'Gwei');
      dispatch(getGasPriceFastSuccess(gasPriceFastInWei));
    } catch(err) {
      console.error(err);
    }
  }
};

const getGasPriceFastSuccess = (gasPriceFastInWei) => ({
  type: GET_GAS_PRICE_FAST,
  payload: gasPriceFastInWei
})

export function getGasPriceAverage() {
  return async function (dispatch) {
    try {
      const gasPrice = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
      const gasPriceAverageInGwei =  (gasPrice.data.average/10).toString();
      const gasPriceAverageInWei = WEB3.utils.toWei(gasPriceAverageInGwei, 'Gwei');
      dispatch(getGasPriceAverageSuccess(gasPriceAverageInWei));
    } catch(err) {
      console.error(err);
    }
  }
};

const getGasPriceAverageSuccess = (gasPriceAverageInWei) => ({
  type: GET_GAS_PRICE_AVERAGE,
  payload: gasPriceAverageInWei
})

export function getGasPriceSlow() {
  return async function (dispatch) {
    try {
      const gasPrice = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
      const gasPriceSlowInGwei =  (gasPrice.data.safeLow/10).toString();
      const gasPriceSlowInWei = WEB3.utils.toWei(gasPriceSlowInGwei, 'Gwei');
      dispatch(getGasPriceSlowSuccess(gasPriceSlowInWei));
    } catch(err) {
      console.error(err);
    }
  }
};

const getGasPriceSlowSuccess = (gasPriceSlowInWei) => ({
  type: GET_GAS_PRICE_SLOW,
  payload: gasPriceSlowInWei
})

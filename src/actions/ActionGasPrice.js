'use strict';
import { GET_GAS_PRICE_FAST, GET_GAS_PRICE_AVERAGE, GET_GAS_PRICE_SLOW } from '../constants/ActionTypes';
import axios from 'axios';
import ProviderUtilities from '../utilities/ProviderUtilities.ts';

const WEB3 = ProviderUtilities.setProvider();

export function getGasPriceFast() {
  return async function (dispatch) {
    try {
      const gasPrice = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
      const gasPriceFastInGwei =  gasPrice.data.fast.toString();
      const gasPriceFastInWei = WEB3.utils.toWei(gasPriceFastInGwei, 'Gwei');
      const gasPriceFastInEther = WEB3.utils.fromWei(gasPriceFastInWei, 'Ether');
      dispatch(getGasPriceFastSuccess(gasPriceFastInEther));
    } catch(err) {
      console.error(err);
    }
  }
};

const getGasPriceFastSuccess = (gasPriceFastInEther) => ({
  type: GET_GAS_PRICE_FAST,
  payload: gasPriceFastInEther
})

export function getGasPriceAverage() {
  return async function (dispatch) {
    try {
      const gasPrice = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
      const gasPriceAverageInGwei =  gasPrice.data.average.toString();
      const gasPriceAverageInWei = WEB3.utils.toWei(gasPriceAverageInGwei, 'Gwei');
      const gasPriceAverageInEther = WEB3.utils.fromWei( gasPriceAverageInWei, 'Ether');
      dispatch(getGasPriceAverageSuccess(gasPriceAverageInEther));
    } catch(err) {
      console.error(err);
    }
  }
};

const getGasPriceAverageSuccess = (gasPriceAverageInEther) => ({
  type: GET_GAS_PRICE_AVERAGE,
  payload: gasPriceAverageInEther
})

export function getGasPriceSlow() {
  return async function (dispatch) {
    try {
      const gasPrice = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
      const gasPriceSlowInGwei =  gasPrice.data.safeLow.toString();
      const gasPriceSlowInWei = WEB3.utils.toWei(gasPriceSlowInGwei, 'Gwei');
      const gasPriceSlowInEther = WEB3.utils.fromWei(gasPriceSlowInWei, 'Ether');
      dispatch(getGasPriceSlowSuccess(gasPriceSlowInEther));
    } catch(err) {
      console.error(err);
    }
  }
};

const getGasPriceSlowSuccess = (gasPriceSlowInEther) => ({
  type: GET_GAS_PRICE_SLOW,
  payload: gasPriceSlowInEther
})

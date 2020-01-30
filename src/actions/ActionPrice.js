'use strict';
import axios from 'axios';
import { GET_DAI_PRICE, GET_ETH_PRICE } from '../constants/ActionTypes';
import DebugUtilities from '../utilities/DebugUtilities.js';

export function getDaiPrice() {
  return async function (dispatch) {
    try {
      const res = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=DAI&tsyms=USD');
      const daiPrice = parseFloat(res.data.USD).toFixed(2);
      dispatch(getDaiPriceSuccess(daiPrice));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const getDaiPriceSuccess = (daiPrice) => ({
  type: GET_DAI_PRICE,
  payload: daiPrice
});

export function getEthPrice() {
  return async function (dispatch) {
    try {
      const res = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD');
      const ethPrice = parseFloat(res.data.USD).toFixed(2);
      dispatch(getEthPriceSuccess(ethPrice));
    } catch(err) {
      DebugUtilities.logError(err);
    }
  }
};

const getEthPriceSuccess = (ethPrice) => ({
  type: GET_ETH_PRICE,
  payload: ethPrice
});

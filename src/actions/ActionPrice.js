'use strict';
import { GET_DAI_PRICE, GET_ETH_PRICE } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function getDaiPrice() {
  return async function (dispatch) {
    try {
      let res = await fetch(
        'https://min-api.cryptocompare.com/data/price?fsym=DAI&tsyms=USD'
      );
      res = await res.json();
      const daiPrice = parseFloat(res.USD).toFixed(2);
      dispatch(getDaiPriceSuccess(daiPrice));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const getDaiPriceSuccess = (daiPrice) => ({
  type: GET_DAI_PRICE,
  payload: daiPrice
});

export function getEthPrice() {
  return async function (dispatch) {
    try {
      let res = await fetch(
        'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'
      );
      res = await res.json();
      const ethPrice = parseFloat(res.USD).toFixed(2);
      dispatch(getEthPriceSuccess(ethPrice));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const getEthPriceSuccess = (ethPrice) => ({
  type: GET_ETH_PRICE,
  payload: ethPrice
});

'use strict';
import { GET_ETH_PRICE } from '../constants/ActionTypes';
import { GET_DAI_PRICE } from '../constants/ActionTypes';
import axios from 'axios';

export function getEthPrice() {
  return async function (dispatch) {
    try {
      const res = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD');
      const ethprice = parseFloat(res.data.USD).toFixed(2);
      dispatch(getEthPriceSuccess(ethprice));
    } catch(err) {
      console.error(err);
    }
  }
};

const getEthPriceSuccess = (ethprice) => ({
  type: GET_ETH_PRICE,
  payload: ethprice
})

export function getDaiPrice() {
  return async function (dispatch) {
    try {
      const res = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=DAI&tsyms=USD');
      const daiprice = parseFloat(res.data.USD).toFixed(2);
      dispatch(getDaiPriceSuccess(daiprice));
    } catch(err) {
      console.error(err);
    }
  }
};

const getDaiPriceSuccess = (daiprice) => ({
  type: GET_DAI_PRICE,
  payload: daiprice
})

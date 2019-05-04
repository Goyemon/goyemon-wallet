'use strict';
import { GET_GAS_PRICE } from '../constants/ActionTypes';
import axios from 'axios';

export function getGasPrice() {
  return async function (dispatch) {
    try {
      const gasPrice = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
      dispatch(getGasPriceSuccess(gasPrice));
    } catch(err) {
      console.error(err);
    }
  }
};

const getGasPriceSuccess = (gasPrice) => ({
  type: GET_GAS_PRICE,
  payload: gasPrice
})

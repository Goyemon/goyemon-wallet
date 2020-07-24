'use strict';
import {
  GET_GAS_PRICE,
  UPDATE_GAS_PRICE_CHOSEN
} from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function getGasPrice() {
  return async function (dispatch) {
    try {
      let gasPrice = await fetch(
        'https://ethgasstation.info/json/ethgasAPI.json'
      );
      if (gasPrice.status === 200) {
        gasPrice = await gasPrice.json();
        dispatch(getGasPriceSuccess(gasPrice));
      } else {
        LogUtilities.logInfo('http error');
      }
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const getGasPriceSuccess = (gasPrice) => ({
  type: GET_GAS_PRICE,
  payload: gasPrice
});

export function updateGasPriceChosen(key) {
  return async function (dispatch) {
    try {
      dispatch(updateGasPriceChosenSuccess(key));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const updateGasPriceChosenSuccess = (key) => ({
  type: UPDATE_GAS_PRICE_CHOSEN,
  payload: key
});

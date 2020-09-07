"use strict";
import {
  GET_DAI_PRICE,
  GET_ETH_PRICE,
  GET_CDAI_PRICE
} from "../constants/ActionTypes";
import LogUtilities from "../utilities/LogUtilities.js";

export function getDAIPrice() {
  return async function (dispatch) {
    try {
      let res = await fetch(
        "https://min-api.cryptocompare.com/data/price?fsym=DAI&tsyms=USD"
      );
      res = await res.json();
      const DAIPrice = parseFloat(res.USD).toFixed(2);
      dispatch(getDAIPriceSuccess(DAIPrice));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const getDAIPriceSuccess = (DAIPrice) => ({
  type: GET_DAI_PRICE,
  payload: DAIPrice
});

export function getETHPrice() {
  return async function (dispatch) {
    try {
      let res = await fetch(
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
      );
      res = await res.json();
      const ETHPrice = parseFloat(res.USD).toFixed(2);
      dispatch(getETHPriceSuccess(ETHPrice));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const getETHPriceSuccess = (ETHPrice) => ({
  type: GET_ETH_PRICE,
  payload: ETHPrice
});

export function getCDAIPrice() {
  return async function (dispatch) {
    try {
      let res = await fetch("https://api.compound.finance/api/v2/ctoken");
      res = await res.json();
      const cDAIRes = res.cToken.filter((cToken) => cToken.symbol === "cDAI");
      const CDAIPrice = parseFloat(cDAIRes[0].exchange_rate.value).toFixed(8);
      dispatch(getCDAIPriceSuccess(CDAIPrice));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const getCDAIPriceSuccess = (CDAIPrice) => ({
  type: GET_CDAI_PRICE,
  payload: CDAIPrice
});

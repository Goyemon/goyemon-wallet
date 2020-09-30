"use strict";
import Web3 from "web3";
import {
  GET_GAS_PRICE,
  UPDATE_GAS_PRICE_CHOSEN
} from "../constants/ActionTypes";
import LogUtilities from "../utilities/LogUtilities";

const INITIAL_STATE = {
  gasPrice: [
    {
      speed: "super fast",
      value: 0,
      wait: 0
    },
    {
      speed: "fast",
      value: 0,
      wait: 0
    },
    {
      speed: "normal",
      value: 0,
      wait: 0
    }
  ],
  gasChosen: 1
};

const gasPrice = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case GET_GAS_PRICE: {
      const gasPriceSuperFastGwei = (action.payload.fast / 10).toString();
      const gasPriceSuperFastWei = /^[0-9]\d*(\.\d+)?$/.test(
        gasPriceSuperFastGwei
      )
        ? Web3.utils.toWei(gasPriceSuperFastGwei, "Gwei")
        : "";

      const gasPriceFastGwei = (action.payload.average / 10).toString();
      const gasPriceFastWei = /^[0-9]\d*(\.\d+)?$/.test(gasPriceFastGwei)
        ? Web3.utils.toWei(gasPriceFastGwei, "Gwei")
        : "";

      const gasPriceNormalGwei = (action.payload.safeLow / 10).toString();
      const gasPriceNormalWei = /^[0-9]\d*(\.\d+)?$/.test(gasPriceNormalGwei)
        ? Web3.utils.toWei(gasPriceNormalGwei, "Gwei")
        : "";

      const { fastWait, avgWait, safeLowWait } = action.payload;

      return {
        gasPrice: state.gasPrice.map((gasPrice) => {
          if (gasPrice.speed === "super fast") {
            return {
              speed: "super fast",
              value: gasPriceSuperFastWei,
              wait: fastWait
            };
          } else if (gasPrice.speed === "fast") {
            return { speed: "fast", value: gasPriceFastWei, wait: avgWait };
          } else if (gasPrice.speed === "normal") {
            return {
              speed: "normal",
              value: gasPriceNormalWei,
              wait: safeLowWait
            };
          } else {
            LogUtilities.logInfo("no gas speed matches");
          }
        }),
        gasChosen: state.gasChosen
      };
    }
    case UPDATE_GAS_PRICE_CHOSEN:
      return { ...state, gasChosen: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default gasPrice;

"use strict";
import { store } from "../store/store.js";
import LogUtilities from "./LogUtilities";

class PriceUtilities {
  convertETHToUSD(eth) {
    const stateTree = store.getState();
    const price = stateTree.ReducerPrice.price;

    try {
      if (!eth) {
        return 0;
      } else {
        const USDValue = parseFloat(price.eth) * parseFloat(eth);
        const roundedETHValueInUSD = USDValue;
        return roundedETHValueInUSD;
      }
    } catch (error) {
      LogUtilities.logError(error);
    }
  }

  convertDAIToUSD(dai) {
    const stateTree = store.getState();
    const price = stateTree.ReducerPrice.price;

    try {
      if (!dai) {
        return 0;
      } else {
        const USDValue = price.dai * parseFloat(dai);
        const roundedDAIValueInUSD = parseFloat(USDValue);
        return roundedDAIValueInUSD;
      }
    } catch (error) {
      LogUtilities.logError(error);
    }
  }

  convertCDAIToUSD(cdai) {
    const stateTree = store.getState();
    const price = stateTree.ReducerPrice.price;

    try {
      if (!cdai) {
        return 0;
      } else {
        const USDValue = price.cdai * parseFloat(cdai);
        const roundedDAIValueInUSD = parseFloat(USDValue);
        return roundedDAIValueInUSD;
      }
    } catch (error) {
      LogUtilities.logError(error);
    }
  }

  getTotalWalletBalance(ETHBalance, DAIBalance, CDAIBalance, PLDAIBalance) {
    let totalUSDBalance =
      parseFloat(this.convertETHToUSD(ETHBalance)) +
      parseFloat(this.convertDAIToUSD(DAIBalance)) +
      parseFloat(this.convertCDAIToUSD(CDAIBalance)) +
      parseFloat(this.convertDAIToUSD(PLDAIBalance));
    totalUSDBalance = parseFloat(totalUSDBalance).toFixed(2);
    return totalUSDBalance;
  }
}

export default new PriceUtilities();

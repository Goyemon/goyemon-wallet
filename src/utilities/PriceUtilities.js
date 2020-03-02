'use strict';
import { store } from '../store/store.js';
import LogUtilities from '../utilities/LogUtilities.js';

class PriceUtilities {
  convertEthToUsd(ether) {
    const stateTree = store.getState();
    const price = stateTree.ReducerPrice.price;

    try {
      const usdValue = parseFloat(price.eth) * parseFloat(ether);
      const roundedEthUsdValue = usdValue;
      return roundedEthUsdValue;
    } catch (error) {
      LogUtilities.logError(error);
    }
  }

  convertDaiToUsd(dai) {
    const stateTree = store.getState();
    const price = stateTree.ReducerPrice.price;

    try {
      const usdValue = price.dai * parseFloat(dai);
      const roundedDaiUsdValue = parseFloat(usdValue);
      return roundedDaiUsdValue;
    } catch (error) {
      LogUtilities.logError(error);
    }
  }

  getDaiUsdBalance(daiBalance) {
    try {
      return this.convertDaiToUsd(daiBalance);
    } catch (err) {
      LogUtilities.logError(err);
    }
  }

  getTotalBalance(ethBalance, daiBalance) {
    let totalUsdBalance =
      parseFloat(this.convertEthToUsd(ethBalance)) +
      parseFloat(this.convertDaiToUsd(daiBalance));
    totalUsdBalance = parseFloat(totalUsdBalance).toFixed(2);
    return totalUsdBalance;
  }
}

export default new PriceUtilities();

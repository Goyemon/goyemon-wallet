'use strict';
import { store } from '../navigators/AppTab';

class PriceUtilities {
  convertEthToUsd(ethBalance) {
    const stateTree = store.getState();
    const ethPrice = stateTree.ReducerPrice.price.ethPrice;

    try {
      const parsedEthBalance = parseFloat(ethBalance);
      const usdBalance = ethPrice * parsedEthBalance;
      const roundedEthUsdBalance = parseFloat(usdBalance).toFixed(2);
      return roundedEthUsdBalance;
    } catch (err) {
      console.error(err);
    }
  }

  convertDaiToUsd(daiBalance) {
    const stateTree = store.getState();
    const daiPrice = stateTree.ReducerPrice.price.daiPrice;

    try {
      const parsedDaiBalance = parseFloat(daiBalance);
      const usdBalance = daiPrice * parsedDaiBalance;
      const roundedDaiUsdBalance = parseFloat(usdBalance).toFixed(2);
      return roundedDaiUsdBalance;
    } catch (err) {
      console.error(err);
    }
  }
}

export default new PriceUtilities();

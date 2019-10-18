'use strict';
import { store } from '../navigators/AppTab';

class PriceUtilities {
  convertEthToUsd(ether) {
    const stateTree = store.getState();
    const ethPrice = stateTree.ReducerPrice.price.ethPrice;

    try {
      const usdValue = ethPrice * parseFloat(ether);
      const roundedEthUsdValue = parseFloat(usdValue).toFixed(2);
      return roundedEthUsdValue;
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

'use strict';
import { store } from '../store/store.js';

class PriceUtilities {
  convertEthToUsd(ether) {
    const stateTree = store.getState();
    const ethPrice = stateTree.ReducerPrice.price.ethPrice;

    try {
      const usdValue = parseFloat(ethPrice) * parseFloat(ether);
      const roundedEthUsdValue = usdValue.toFixed(3);
      return roundedEthUsdValue;
    } catch (err) {
      console.error(err);
    }
  }

  convertDaiToUsd(dai) {
    const stateTree = store.getState();
    const daiPrice = stateTree.ReducerPrice.price.daiPrice;

    try {
      const usdValue = daiPrice * parseFloat(dai);
      const roundedDaiUsdValue = parseFloat(usdValue).toFixed(2);
      return roundedDaiUsdValue;
    } catch (err) {
      console.error(err);
    }
  }
}

export default new PriceUtilities();

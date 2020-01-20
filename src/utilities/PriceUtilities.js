'use strict';
import { store } from '../store/store.js';

class PriceUtilities {
  convertEthToUsd(ether) {
    const stateTree = store.getState();
    const price = stateTree.ReducerPrice.price;

    try {
      const usdValue = parseFloat(price.eth) * parseFloat(ether);
      const roundedEthUsdValue = usdValue;
      return roundedEthUsdValue;
    } catch (error) {
      console.error(error);
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
      console.error(error);
    }
  }
}

export default new PriceUtilities();

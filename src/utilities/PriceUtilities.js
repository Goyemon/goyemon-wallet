'use strict';
import { store } from '../store/store.js';
import LogUtilities from './LogUtilities';

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

  convertcDaiToUsd(cdai) {
    const stateTree = store.getState();
    const price = stateTree.ReducerPrice.price;

    try {
      const usdValue = price.cdai * parseFloat(cdai);
      const roundedDaiUsdValue = parseFloat(usdValue);
      return roundedDaiUsdValue;
    } catch (error) {
      LogUtilities.logError(error);
    }
  }

  getDaiUsdBalance(daiBalance) {
    try {
      return this.convertDaiToUsd(daiBalance).toFixed(2);
    } catch (err) {
      LogUtilities.logError(err);
    }
  }

  getEthUsdBalance(ethBalance) {
    try {
      let ethUsdBalance = this.convertEthToUsd(ethBalance);
      ethUsdBalance = ethUsdBalance.toFixed(2);
      return ethUsdBalance;
    } catch (err) {
      LogUtilities.logError(err);
    }
  }

  getTotalWalletBalance(ethBalance, daiBalance, cdaiBalance, pldaiBalance) {
    let totalUsdBalance =
      parseFloat(this.convertEthToUsd(ethBalance)) +
      parseFloat(this.convertDaiToUsd(daiBalance)) +
      parseFloat(this.convertcDaiToUsd(cdaiBalance)) +
      parseFloat(this.convertDaiToUsd(pldaiBalance));
    totalUsdBalance = parseFloat(totalUsdBalance).toFixed(2);
    return totalUsdBalance;
  }
}

export default new PriceUtilities();

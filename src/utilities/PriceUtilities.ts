"use strict";
import { store } from "../store/store";
import LogUtilities from "./LogUtilities";

class PriceUtilities {
  convertETHToUSD(eth: any): number {
    const stateTree = store.getState();
    const price = stateTree.ReducerPrice.price;

    try {
      if (!eth) {
        return 0;
      } else {
        const USDValue = parseFloat(price.eth) * parseFloat(eth);
        const roundedETHValueInUSD = USDValue;
        return roundedETHValueInUSD || 0;
      }
    } catch (error) {
      LogUtilities.logError(error);
      return 0;
    }
  }

  convertDAIToUSD(dai: any): number {
    const stateTree = store.getState();
    const price = stateTree.ReducerPrice.price;

    try {
      if (!dai) {
        return 0;
      } else {
        const USDValue = price.dai * parseFloat(dai);
        const roundedDAIValueInUSD = parseFloat(USDValue.toString());
        return roundedDAIValueInUSD || 0;
      }
    } catch (error) {
      LogUtilities.logError(error);
      return 0;
    }
  }

  convertCDAIToUSD(cdai: any): number {
    const stateTree = store.getState();
    const price = stateTree.ReducerPrice.price;

    try {
      if (!cdai) {
        return 0;
      } else {
        const USDValue = price.cdai * parseFloat(cdai);
        const roundedDAIValueInUSD = parseFloat(USDValue.toString());
        return roundedDAIValueInUSD || 0;
      }
    } catch (error) {
      LogUtilities.logError(error);
      return 0;
    }
  }

  getTotalWalletBalance(
    ETHBalance: any,
    DAIBalance: any,
    CDAIBalance: any,
    PLDAIBalance: any
  ) {
    return (
      parseFloat(this.convertETHToUSD(ETHBalance).toString()) +
      parseFloat(this.convertDAIToUSD(DAIBalance).toString()) +
      parseFloat(this.convertCDAIToUSD(CDAIBalance).toString()) +
      parseFloat(this.convertDAIToUSD(PLDAIBalance).toString())
    ).toFixed(2);
  }
}

export default new PriceUtilities();

"use strict";
import { SAVE_COMPOUND_DAI_INFO } from "../constants/ActionTypes";
import LogUtilities from "../utilities/LogUtilities";

export const getCompound = (address: string) => async (dispatch: any) => {
  try {
    let cToken: any = await fetch("https://api.compound.finance/api/v2/ctoken");
    let compound: any = await fetch(
      `https://api.compound.finance/api/v2/account?addresses[]=${address}`
    );
    cToken = await cToken.json();
    compound = await compound.json();
    let exchangeRate, supplyRate, lifetimeSupply;
    for (const element of cToken.cToken)
      if (element.underlying_symbol == "USDT") {
        exchangeRate = element.exchange_rate.value;
        supplyRate = element.supply_rate.value;
      }
    for (const element of compound.accounts) {
      if (element.address.toLowerCase() == address.toLowerCase()) {
        for (const child of element.tokens) {
          if (child.symbol == "cDAI") {
            lifetimeSupply = child.lifetime_supply_interest_accrued.value;
          }
        }
      }
    }
    dispatch(
      saveCompoundDaiInfoSuccess({
        exchangeRate,
        supplyRate,
        lifetimeSupply
      })
    );
  } catch (err) {
    LogUtilities.toDebugScreen(err);
  }
};

const saveCompoundDaiInfoSuccess = (compoundDaiInfo: any) => ({
  type: SAVE_COMPOUND_DAI_INFO,
  payload: compoundDaiInfo
});

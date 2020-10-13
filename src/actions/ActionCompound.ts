"use strict";
import { SAVE_COMPOUND_DAI_INFO } from "../constants/ActionTypes";
import { saveCompoundDaiBalance } from "./ActionBalance";
import LogUtilities from "../utilities/LogUtilities";
import { store } from "../store/store";

export const saveCompoundDaiInfo = (address: string) => async (
  dispatch: any
) => {
  try {
    let cTokenInfo: any = await fetch(
      "https://api.compound.finance/api/v2/ctoken"
    );
    let accountsInfo: any = await fetch(
      `https://api.compound.finance/api/v2/account?addresses[]=${address}`
    );
    cTokenInfo = await cTokenInfo.json();
    accountsInfo = await accountsInfo.json();
    let exchangeRate, supplyRate, lifetimeInterestEarned;
    cTokenInfo.cToken.forEach((element: any) => {
      if (element.underlying_symbol == "DAI") {
        exchangeRate = element.exchange_rate.value;
        supplyRate = element.supply_rate.value;
      }
    });

    if (accountsInfo.accounts.length === 0) {
      lifetimeInterestEarned = 0;
    } else if (accountsInfo.accounts.length > 0) {
      accountsInfo.accounts.forEach((element: any) => {
        if (element.address.toLowerCase() == address.toLowerCase()) {
          element.tokens.forEach((child: any) => {
            if (child.symbol === "cDAI") {
              lifetimeInterestEarned =
                child.lifetime_supply_interest_accrued.value;
            }
          });
        }
      });
    }

    const stateTree = store.getState();
    store.dispatch(
      saveCompoundDaiBalance(
        stateTree.ReducerBalance.balance.cDai,
        stateTree.ReducerCompound.compound.dai.currentExchangeRate
      )
    );

    dispatch(
      saveCompoundDaiInfoSuccess({
        exchangeRate,
        supplyRate,
        lifetimeInterestEarned
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

"use strict";
import BigNumber from "bignumber.js";
import {
  saveCDaiBalance,
  saveDaiBalance,
  saveCompoundDaiBalance,
  savePoolTogetherDaiBalance,
  saveWeiBalance,
  movePoolTogetherDaiBalance
} from "../actions/ActionBalance";
import { saveCompoundDaiInfo } from "../actions/ActionCompound";
import {
  savePoolTogetherDaiInfo,
  togglePoolTogetherWinnerRevealed
} from "../actions/ActionPoolTogether";
import { saveUniswapV2WETHxDAIReserve } from "../actions/ActionUniswap";
import { saveTransactionsLoaded } from "../actions/ActionTransactionsLoaded";
import LogUtilities from "../utilities/LogUtilities";
import { store } from "../store/store";
import { storage } from "../lib/tx";

let storeReady = false;
let storeReadyPromise: any;

export const setStoreReadyPromise = (p: any) => {
  storeReadyPromise = p;
};

export const downstreamMessageHandler = async (type: any, data: any) => {
  LogUtilities.logInfo(`received message ${type} => `, data);

  if (!storeReady) {
    await storeReadyPromise;
    storeReady = true;
  }

  const stateTree = store.getState();

  if (!stateTree.ReducerChecksumAddress.checksumAddress) return;

  switch (type) {
    case "txhistory":
      // storage.setOwnAddress(checksumAddress);
      await storage.clear();
      await storage.parseTxHistory(data);
      store.dispatch(saveTransactionsLoaded(true));
      break;

    case "txstate":
      await Promise.all(
        Object.entries(data).map(([hash, data]) =>
          storage.processTxState(hash, data)
        )
      );
      break;

    case "txsync":
      await storage.processTxSync(data);
      break;

    case "balance":
      if (data.hasOwnProperty("eth"))
        store.dispatch(
          saveWeiBalance(new BigNumber(`0x${data.eth}`).toString(10))
        );

      if (data.hasOwnProperty("dai"))
        store.dispatch(
          saveDaiBalance(new BigNumber(`0x${data.dai}`).toString(10))
        );

      if (data.hasOwnProperty("cdai")) {
        store.dispatch(
          await saveCompoundDaiInfo(
            stateTree.ReducerChecksumAddress.checksumAddress
          )
        );

        store.dispatch(
          saveCompoundDaiBalance(
            stateTree.ReducerBalance.balance.cDai,
            stateTree.ReducerCompound.compound.dai.currentExchangeRate
          )
        );

        store.dispatch(
          saveCDaiBalance(new BigNumber(`0x${data.cdai}`).toString(10))
        );
      }

      if (data.hasOwnProperty("pooltogether")) {
        const pooltogetherDaiBalance = data.pooltogether;
        const pooltogetherDaiBalanceArray = pooltogetherDaiBalance.split("|");
        store.dispatch(savePoolTogetherDaiBalance(pooltogetherDaiBalanceArray));
      }

      break;

    case "transactionError":
      LogUtilities.toDebugScreen(
        `downstreamMessageHandler(): received transactionError for nonce:${data.nonce}:`,
        data
      );
      storage.markNotIncludedTxAsErrorByNonce(parseInt(data.nonce));

      break;

    case "pool_together_DAI_info": {
      const pooltogetherDaiInfo = {
        ...data,
        pooltogether_accounted_balance: new BigNumber(
          `0x${data.pooltogether_accounted_balance}`
        ).toString(10),
        pooltogether_open_supply: new BigNumber(
          `0x${data.pooltogether_open_supply}`
        ).toString(10),
        pooltogether_committed_supply: new BigNumber(
          `0x${data.pooltogether_committed_supply}`
        ).toString(10),
        pooltogether_estimated_interest_rate: new BigNumber(
          `0x${data.pooltogether_estimated_interest_rate}`
        ).toString(10),
        pooltogether_committed_drawid: data.pooltogether_committed_drawid,
        pooltogether_rewarded: data.pooltogether_rewarded,
        pooltogether_winnings: data.pooltogether_winnings
      };
      store.dispatch(savePoolTogetherDaiInfo(pooltogetherDaiInfo));
      if (
        stateTree.ReducerPoolTogether.poolTogether.dai.currentCommittedDrawId !=
          "" &&
        stateTree.ReducerPoolTogether.poolTogether.dai.currentCommittedDrawId !=
          data.pooltogether_committed_drawid
      ) {
        store.dispatch(movePoolTogetherDaiBalance());
        store.dispatch(togglePoolTogetherWinnerRevealed(false));
      }
      break;
    }

    case "uniswapV2_WETHxDAI_reserve":
      store.dispatch(saveUniswapV2WETHxDAIReserve(data));
      break;

    default:
      LogUtilities.logInfo(`unknown message type: ${type}`);
  }
};

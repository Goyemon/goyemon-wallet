'use strict';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import {
  saveCDaiBalance,
  saveDaiBalance,
  saveDaiSavingsBalance,
  saveWeiBalance
} from '../actions/ActionBalance';
import {
  saveCDaiLendingInfo,
  saveDaiApprovalInfo
} from '../actions/ActionCDaiLendingInfo';
import {
  saveTransactionsLoaded
} from '../actions/ActionTransactionsLoaded';
import {
  saveExistingTransactions,
  saveEmptyTransaction,
  addPendingOrIncludedTransaction,
  updateWithPendingOrIncludedTransaction,
  updateTransactionState,
  addConfirmedTransaction,
  updateConfirmedTransactionData,
  removeExistingTransactionObject,
  updateErrorSentTransaction
} from '../actions/ActionTransactionHistory';
import { saveDaiExchangeReserve } from '../actions/ActionExchangeReserve';
import LogUtilities from '../utilities/LogUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import { store } from '../store/store';
import { saveOtherDebugInfo } from '../actions/ActionDebugInfo.js';

import TxStorage from '../lib/tx.js';


async function downstreamMessageHandler(type, data) {
	LogUtilities.logInfo(`received message ${type} => `, data);
	let stateTree;

	switch (type) {
		case 'txhistory':
			// TxStorage.storage.setOwnAddress(checksumAddress);
          	await TxStorage.storage.clear(true);
		  	await TxStorage.storage.parseTxHistory(data);
			await TxStorage.storage.__tempstoragewritten();
			store.dispatch(saveTransactionsLoaded(true));
			break;

		case 'txstate':
			await Promise.all(Object.entries(data).map(([hash, data]) => TxStorage.storage.processTxState(hash, data)));
			break;

		case 'balance':
			stateTree = store.getState();

			if (data.hasOwnProperty('eth'))
				store.dispatch(saveWeiBalance(new BigNumber(data.eth).toString(10)));

			if (data.hasOwnProperty('dai'))
				store.dispatch(saveDaiBalance(new BigNumber(data.dai).toString(10)));

			if (data.hasOwnProperty('cdai')) {
				setTimeout(() => {
					FcmUpstreamMsgs.requestCDaiLendingInfo(stateTree.ReducerChecksumAddress.checksumAddress);
				}, 15000);

		  		store.dispatch(saveCDaiBalance(new BigNumber(data.cdai).toString(10)));
			}
			break;

		case 'cDai_lending_info':
			stateTree = store.getState();
			// const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;
			store.dispatch(saveCDaiLendingInfo(data));
			store.dispatch(
				saveDaiSavingsBalance(
					stateTree.ReducerBalance.balance.cDaiBalance,
					data.current_exchange_rate
				)
			);
			break;

		case 'transactionError':
			if (data.error.message === 'nonce too low') // why only this if that transaction is guaranteed not to be propagated?
				TxStorage.storage.markSentTxAsErrorByNonce(parseInt(data.nonce));

			break;

		case 'uniswap_ETHDAI_info':
			store.dispatch(saveDaiExchangeReserve(data));
			break;

		default:
			LogUtilities.logError(`unknown message type: ${type}`);
	}
}

module.exports = {
  downstreamMessageHandler: downstreamMessageHandler
}

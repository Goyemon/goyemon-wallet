'use strict';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import {
  saveCDaiBalance,
  saveDaiBalance,
  saveCompoundDaiBalance,
  savePoolTogetherDaiBalance,
  saveWeiBalance
} from '../actions/ActionBalance';
import {
  saveCompoundDaiInfo
} from '../actions/ActionCompound';
import { saveDaiExchangeReserve } from '../actions/ActionUniswap';
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
import FcmUpstreamMsgs from '../firebase/FcmUpstreamMsgs.ts';
import LogUtilities from '../utilities/LogUtilities.js';
import TransactionUtilities from '../utilities/TransactionUtilities.ts';
import { store } from '../store/store';
import { saveOtherDebugInfo } from '../actions/ActionDebugInfo.js';

import TxStorage from '../lib/tx.js';

var storeReady = false
var storeReadyPromise;

function setStoreReadyPromise(p) {
	storeReadyPromise = p;
}

async function downstreamMessageHandler(type, data) {
	LogUtilities.logInfo(`received message ${type} => `, data);

	if (!storeReady) {
		await storeReadyPromise;
		storeReady = true;
	}

	const stateTree = store.getState();

	if (!stateTree.ReducerChecksumAddress.checksumAddress)
		return;

	switch (type) {
		case 'txhistory':
			// TxStorage.storage.setOwnAddress(checksumAddress);
          	await TxStorage.storage.clear(true);
		  	await TxStorage.storage.parseTxHistory(data);
			store.dispatch(saveTransactionsLoaded(true));
			break;

		case 'txstate':
			await Promise.all(Object.entries(data).map(([hash, data]) => TxStorage.storage.processTxState(hash, data)));
			break;

		case 'txsync':
			await TxStorage.storage.processTxSync(data);
			break;

		case 'balance':
			if (data.hasOwnProperty('eth'))
				store.dispatch(saveWeiBalance(new BigNumber(data.eth).toString(10)));

			if (data.hasOwnProperty('dai'))
				store.dispatch(saveDaiBalance(new BigNumber(data.dai).toString(10)));

			if (data.hasOwnProperty('cdai')) {
				FcmUpstreamMsgs.requestCompoundDaiInfo(stateTree.ReducerChecksumAddress.checksumAddress);
		  		store.dispatch(saveCDaiBalance(new BigNumber(data.cdai).toString(10)));
			}

			if (data.hasOwnProperty('pooltogetherDai'))
				store.dispatch(savePoolTogetherDaiBalance(new BigNumber(data.pooltogetherDai).toString(10)));

			break;

		case 'cDai_lending_info':
			// const checksumAddress = stateTree.ReducerChecksumAddress.checksumAddress;
			store.dispatch(saveCompoundDaiInfo(data));
			store.dispatch(
				saveCompoundDaiBalance(
					stateTree.ReducerBalance.balance.cDai,
					data.current_exchange_rate
				)
			);
			break;

		case 'transactionError':
			if (data.error.message === 'nonce too low') // why only this if that transaction is guaranteed not to be propagated?
				TxStorage.storage.markNotIncludedTxAsErrorByNonce(parseInt(data.nonce));

			break;

		case 'uniswap_ETHDAI_info':
			store.dispatch(saveDaiExchangeReserve(data));
			break;

		default:
			LogUtilities.logError(`unknown message type: ${type}`);
	}
}

module.exports = {
	setStoreReadyPromise: setStoreReadyPromise,
	downstreamMessageHandler: downstreamMessageHandler
}

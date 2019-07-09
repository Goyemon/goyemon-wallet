'use strict';
import { GET_EXISTING_TRANSACTIONS } from '../constants/ActionTypes';
import { ADD_NEW_TRANSACTION } from '../constants/ActionTypes';
import axios from 'axios';
import TransactionController from '../wallet-core/TransactionController.ts';

export function getExistingTransactions(address) {
  return async function (dispatch) {
    try {
      const existingTransactions = await axios.get(`http://46.105.123.97/eth.php?a=gettx&addr=${address}`);
      const parsedExistingTransactions = TransactionController.parseTransactions(existingTransactions.data);
      dispatch(getExistingTransactionsSuccess(parsedExistingTransactions));
    } catch(err) {
      console.error(err);
    }
  }
};

const getExistingTransactionsSuccess = (parsedExistingTransactions) => ({
  type: GET_EXISTING_TRANSACTIONS,
  payload: parsedExistingTransactions
})

export function addNewTransaction(transactionObject) {
  return function (dispatch) {
    try {
      let parsedTransactionObject = TransactionController.parseTransaction(transactionObject);
      dispatch(addNewTransactionSuccess(parsedTransactionObject));
    } catch(err) {
      console.error(err);
    }
  }
};

const addNewTransactionSuccess = (parsedTransactionObject) => ({
  type: ADD_NEW_TRANSACTION,
  payload: parsedTransactionObject
})

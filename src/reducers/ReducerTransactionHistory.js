'use strict';
import { SAVE_EMPTY_TRANSACTION } from '../constants/ActionTypes';
import { SAVE_EXISTING_TRANSACTIONS } from '../constants/ActionTypes';
import { ADD_PENDING_TRANSACTION } from '../constants/ActionTypes';
import { UPDATE_TRANSACTION_STATE } from '../constants/ActionTypes';

const INITIAL_STATE = {
  transactions: null
};

const transactions = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_EMPTY_TRANSACTION:
      return { ...state, transactions: action.payload };
    case SAVE_EXISTING_TRANSACTIONS:
      const transactions = [...state.transactions, ...action.payload];
      const sortedTransactions = transactions.sort((a, b) => b.time - a.time);
      return {
        transactions: sortedTransactions
      };
    case ADD_PENDING_TRANSACTION:
      return {
        transactions: [action.payload, ...state.transactions]
      };
    case UPDATE_TRANSACTION_STATE:
      return {
        transactions: state.transactions.map((transaction, index) => {
          if (action.payload.txhash === transaction.hash) {
            return { ...transaction, state: action.payload.state };
          }
          return transaction;
        })
      };
    default:
      return state;
  }
};

export default transactions;

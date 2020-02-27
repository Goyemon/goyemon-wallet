'use strict';
import {
  SAVE_EMPTY_TRANSACTION,
  SAVE_EXISTING_TRANSACTIONS,
  ADD_SENT_TRANSACTION,
  ADD_PENDING_OR_INCLUDED_TRANSACTION,
  UPDATE_PENDING_OR_INCLUDED_TRANSACTION,
  UPDATE_TRANSACTION_STATE,
  UPDATE_ERROR_SENT_TRANSACTION
} from '../constants/ActionTypes';

const INITIAL_STATE = {
  transactions: null
};

const transactions = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_EMPTY_TRANSACTION:
      return { transactions: action.payload };
    case SAVE_EXISTING_TRANSACTIONS:
      const transactions = [...action.payload];

      let removeSentTx;
      removeSentTx = transactions.map(transaction => transaction.state).indexOf('sent');
      if (removeSentTx === -1) {
        removeSentTx = 0;
      }

      return {
        transactions
      };
    case ADD_SENT_TRANSACTION:
      return {
        transactions: [action.payload, ...state.transactions]
      };
    case ADD_PENDING_OR_INCLUDED_TRANSACTION:
      if (state.transactions === null || Object.keys(state.transactions).length === 0) {
        return {
          transactions: [action.payload]
        };
      } else if (state.transactions.length > 0) {
        return {
          transactions: [action.payload, ...state.transactions]
        };
      }
    case UPDATE_PENDING_OR_INCLUDED_TRANSACTION:
      return {
        transactions: state.transactions.map((transaction, index) => {
          if (transaction.nonce === action.payload.nonce && transaction.state === 'sent') {
            return { ...transaction, ...action.payload };
          }
          return transaction;
        })
      };
    case UPDATE_TRANSACTION_STATE:
      return {
        transactions: state.transactions.map((transaction, index) => {
          if (action.payload.hash === transaction.hash) {
            return { ...transaction, state: action.payload.state };
          }
          return transaction;
        })
      };
    case UPDATE_ERROR_SENT_TRANSACTION:
      return {
        transactions: state.transactions.map((transaction, index) => {
          if (transaction.nonce === action.payload && transaction.state === 'sent') {
            return { ...transaction, state: 'error' };
          }
          return transaction;
        })
      };
    default:
      return state;
  }
};

export default transactions;

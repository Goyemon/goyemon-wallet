'use strict';
import { SAVE_EMPTY_TRANSACTION } from '../constants/ActionTypes';
import { SAVE_EXISTING_TRANSACTIONS } from '../constants/ActionTypes';
import { ADD_SENT_TRANSACTION } from '../constants/ActionTypes';
import { ADD_PENDING_OR_INCLUDED_TRANSACTION } from '../constants/ActionTypes';
import { UPDATE_PENDING_OR_INCLUDED_TRANSACTION } from '../constants/ActionTypes';
import { UPDATE_TRANSACTION_STATE } from '../constants/ActionTypes';

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
    default:
      return state;
  }
};

export default transactions;

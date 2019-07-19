'use strict';
import { GET_EXISTING_TRANSACTIONS } from '../constants/ActionTypes';
import { ADD_PENDING_TRANSACTION } from '../constants/ActionTypes';
import { UPDATE_TRANSACTION_STATE } from '../constants/ActionTypes';

const INITIAL_STATE = {
  transactions: []
};

const transactions = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_EXISTING_TRANSACTIONS:
      return {
        transactions: [...state.transactions, ...action.payload]
      };
    case ADD_PENDING_TRANSACTION:
      return {
        transactions: [action.payload, ...state.transactions]
      };
    case UPDATE_TRANSACTION_STATE:
      return {
        transactions: state.transactions.map((transaction, index) => {
          if (action.payload.txhash === transaction.hash) {
            return {...transaction, state: action.payload.state}
          }
          return transaction
        })
      }
    default:
      return state;
  }
};

export default transactions;

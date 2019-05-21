'use strict';
import { GET_TRANSACTIONS } from '../constants/ActionTypes';

const INITIAL_STATE = {
  transactions: [
    {
      id: 0,
      "inOrOut": 1,
      "date": '2019, April 30th',
      "status": 0,
      "to": "0xa7D41F49dAdCA972958487391d4461a5d0E1c3e9",
      "amount": 0.2
    },
    {
      id: 1,
      "inOrOut": 0,
      "date": '2019, April 20th',
      "status": 1,
      "to": "",
      "amount": 0.5
    },
    {
      id: 2,
      "inOrOut": 0,
      "date": '2019, April 17th',
      "status": 30,
      "to": "",
      "amount": 0.3
    },
    {
      id: 3,
      "inOrOut": 1,
      "date": '2019, April 9th',
      "status": 35,
      "to": "0xa7D41F49dAdCA972958487391d4461a5d0E1c3e9",
      "amount": 0.4
    },
  ]
};

const transactions = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_TRANSACTIONS:
      const getTransactions = state.transactions.map(transaction => {
        return transaction;
      });
      return {
        ...state,
        transactions: getTransactions
      };
    default:
      return state;
  }
};

export default transactions;

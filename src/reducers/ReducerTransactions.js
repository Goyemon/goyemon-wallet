'use strict';
import { GET_TRANSACTIONS } from '../constants/ActionTypes';

const INITIAL_STATE = {
  transactions: [
    {
      "userId": 1,
      "id": 1,
      "title": "delectus aut autem",
      "completed": false
    },
    {
      "userId": 1,
      "id": 2,
      "title": "quis ut nam facilis et officia qui",
      "completed": false
    },
    {
      "userId": 1,
      "id": 3,
      "title": "fugiat veniam minus",
      "completed": false
    },
    {
      "userId": 1,
      "id": 4,
      "title": "et porro tempora",
      "completed": true
    }
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

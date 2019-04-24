import { GET_TRANSACTIONS } from '../constants/ActionTypes';
import axios from 'axios';

export function getTransactions() {
  return async function (dispatch) {
    try {
      const transactions = await axios.get('https://jsonplaceholder.typicode.com/todos');
      dispatch(getTransactionsSuccess(transactions));
    } catch(err) {
      console.error(err);
    }
  }
};

const getTransactionsSuccess = (transactions) => ({
  type: GET_TRANSACTIONS,
  payload: transactions
})

'use strict';
import { GET_ETH_PRICE } from '../constants/ActionTypes';
import { GET_DAI_PRICE } from '../constants/ActionTypes';

const INITIAL_STATE = {
  wallets: [
    { id: 0, coin: 'Ether', notation: 'ETH', price: 0, balance: 0 },
    { id: 1, coin: 'Dai', notation: 'DAI', price: 0, balance: 0 }
  ]
};

const wallets = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ETH_PRICE:
      const getEthWallets = state.wallets.map(wallet => {
        if (wallet.id === 0) {
          return { ...wallet, price: action.payload };
        }
        return wallet;
      });
      return {
        ...state,
        wallets: getEthWallets
      };
    case GET_DAI_PRICE:
      const getDaiWallets = state.wallets.map(wallet => {
        if (wallet.id === 1) {
          return { ...wallet, price: action.payload };
        }
        return wallet;
      });
      return {
        ...state,
        wallets: getDaiWallets
      };
    default:
      return state;
  }
};

export default wallets;

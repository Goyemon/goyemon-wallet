'use strict';

const INITIAL_STATE = {
  wallets: [{ id: 0, coin: 'Ether', notation: 'ETH' }, { id: 1, coin: 'Dai', notation: 'DAI' }]
};

const wallets = (state = INITIAL_STATE, action) => state || INITIAL_STATE;

export default wallets;

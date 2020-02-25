'use strict';

const INITIAL_STATE = {
  currencies: [{ id: 0, name: 'Ether', notation: 'ETH' }, { id: 1, name: 'Dai', notation: 'DAI' }]
};

const currencies = (state = INITIAL_STATE, action) => state || INITIAL_STATE;

export default currencies;

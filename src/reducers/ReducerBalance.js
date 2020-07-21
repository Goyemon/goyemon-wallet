'use strict';
import {
  SAVE_WEI_BALANCE,
  SAVE_DAI_BALANCE,
  SAVE_C_DAI_BALANCE,
  SAVE_COMPOUND_DAI_BALANCE,
  SAVE_POOL_TOGETHER_DAI_BALANCE,
  MOVE_POOL_TOGETHER_DAI_BALANCE
} from '../constants/ActionTypes';
import { RoundDownBigNumberPlacesEighteen } from '../utilities/BigNumberUtilities';

const INITIAL_STATE = {
  balance: {
    wei: '',
    dai: '',
    cDai: '',
    compoundDai: '',
    pooltogetherDai: {
      open: '',
      committed: '',
      sponsored: ''
    }
  }
};

const balance = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_WEI_BALANCE:
      return { balance: { ...state.balance, wei: action.payload } };
    case SAVE_DAI_BALANCE:
      return { balance: { ...state.balance, dai: action.payload } };
    case SAVE_C_DAI_BALANCE:
      return { balance: { ...state.balance, cDai: action.payload } };
    case SAVE_COMPOUND_DAI_BALANCE:
      return {
        balance: { ...state.balance, compoundDai: action.payload }
      };
    case SAVE_POOL_TOGETHER_DAI_BALANCE:
      return {
        balance: {
          ...state.balance,
          pooltogetherDai: {
            open: action.payload[0],
            committed: action.payload[1],
            sponsored: action.payload[2]
          }
        }
      };
    case MOVE_POOL_TOGETHER_DAI_BALANCE:
      return {
        balance: {
          ...state.balance,
          pooltogetherDai: {
            ...state.balance.pooltogetherDai,
            open: '0',
            committed: new RoundDownBigNumberPlacesEighteen(
              state.balance.pooltogetherDai.open
            )
              .plus(state.balance.pooltogetherDai.committed)
              .toString(10)
          }
        }
      };
    default:
      return state || INITIAL_STATE;
  }
};

export default balance;

'use strict';
import { applyMiddleware, createStore } from 'redux';
import { createMigrate, persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducers from '../reducers/ReducerIndex';
import AsyncStorage from '@react-native-community/async-storage';

const migrations = {
  0: (state: any) => {
    return {
      ...state,
      ReducerPrice: {
        price: {
          ...state.price,
          cdai: ''
        }
      }
    };
  }
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'ReducerApproval',
    'ReducerBalance',
    'ReducerCompound',
    'ReducerChecksumAddress',
    'ReducerGasPrice',
    'ReducerMnemonic',
    'ReducerMnemonicWordsValidation',
    'ReducerPermissions',
    'ReducerPoolTogether',
    'ReducerPrice',
    'ReducerTransactionsLoaded',
    'ReducerUniswap'
  ],
  version: 0, // default version is -1
  migrate: createMigrate(migrations, { debug: true })
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = createStore(persistedReducer, applyMiddleware(thunk));

export const persistor = persistStore(store);

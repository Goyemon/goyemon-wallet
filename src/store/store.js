'use strict';
import AsyncStorage from '@react-native-community/async-storage';
import { applyMiddleware, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducers from '../reducers/ReducerIndex';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'ReducerBalance',
    'ReducerCompound',
    'ReducerChecksumAddress',
    'ReducerGasPrice',
    'ReducerMnemonic',
    'ReducerMnemonicWordsValidation',
    'ReducerOutgoingTransactionObjects',
    'ReducerPermissions',
    'ReducerPrice',
    'ReducerTransactionsLoaded',
    'ReducerUniswap'
  ]
};

// 'ReducerTransactionHistory',

const persistedReducer = persistReducer(persistConfig, rootReducers);

const store = createStore(persistedReducer, applyMiddleware(thunk));

const persistor = persistStore(store);

export { store, persistor };

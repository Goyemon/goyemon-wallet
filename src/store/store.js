'use strict';
import { applyMiddleware, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import rootReducers from '../reducers/ReducerIndex';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'ReducerBalance',
    'ReducerCDaiLendingInfo',
    'ReducerChecksumAddress',
    'ReducerGasPrice',
    'ReducerMnemonic',
    'ReducerPermissions',
    'ReducerOutgoingTransactionObjects',
    'ReducerPrice',
    'ReducerTransactionHistory',
    'ReducerTotalTransactions',
    'ReducerCurrencies'
  ]
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

const store = createStore(persistedReducer, applyMiddleware(thunk));

const persistor = persistStore(store);

export { store, persistor };

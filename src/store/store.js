'use strict';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducers from '../reducers/ReducerIndex';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'ReducerOutgoingTransactionObjects',
    'ReducerTransactionHistory',
    'ReducerTransactionCount',
    'ReducerBalance',
    'ReducerChecksumAddress',
    'ReducerWallets',
    'ReducerPrice',
    'ReducerNotificationPermission',
    'ReducerMnemonic'
  ]
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

const store = createStore(persistedReducer, applyMiddleware(thunk));

const persistor = persistStore(store);

export { store, persistor };

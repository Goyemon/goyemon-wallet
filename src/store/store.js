'use strict';
import AsyncStorage from '@react-native-community/async-storage';
import { applyMiddleware, createStore } from 'redux';
import { createMigrate, persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducers from '../reducers/ReducerIndex';

// const migrations = {
//   0: (state) => {
//     return {
//       ...state,
//     }
//   }
// }

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
  // version: 0 // default version is -1
  // migrate: createMigrate(migrations, { debug: true })
};

// 'ReducerTransactionHistory',

const persistedReducer = persistReducer(persistConfig, rootReducers);

const store = createStore(persistedReducer, applyMiddleware(thunk));

const persistor = persistStore(store);

export { store, persistor };

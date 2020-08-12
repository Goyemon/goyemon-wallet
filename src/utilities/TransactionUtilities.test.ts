import TransactionUtilities from './TransactionUtilities';
import * as ReactNative from 'react-native';
// const mockReturnValues = {
//   arrayOne: JSON.stringify(['red', 'blue']),
//   objectOne: JSON.stringify({
//     isATest: true,
//     hasNestedData: {
//       ohYeah: "it's true"
//     }
//   }),
//   stringOne: JSON.stringify('testing string')
// };

// function mockMultiGetTestData() {
//   return [
//     ['key1', JSON.stringify({ valor: 1 })],
//     ['key2', JSON.stringify({ valor: 2 })]
//   ];
// }

jest.mock('@react-native-community/async-storage', () => ({
  setItem: jest.fn(() => {
    return new Promise((resolve) => {
      resolve('null');
    });
  }),
  multiSet: jest.fn(() => {
    return new Promise((resolve) => {
      resolve('null');
    });
  }),
  getItem: jest.fn(() => {
    return new Promise((resolve) => {
      resolve('null');
    });
  }),
  multiGet: jest.fn(() => {
    return new Promise((resolve) => {
      resolve('null');
    });
  }),
  removeItem: jest.fn(() => {
    return new Promise((resolve) => {
      resolve('null');
    });
  }),
  getAllKeys: jest.fn(() => {
    return new Promise((resolve) => {
      resolve(['one', 'two', 'three']);
    });
  }),
  multiRemove: jest.fn(() => ({
    then: jest.fn()
  }))
}));

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn((password) => console.log(password))
}));

jest.mock('react-native', () => {
  return {
    NativeModules: {
      RNRandomBytes: {
        seed: 'seed'
      }
    }
  }
});

test('function checks whether arg is number', () => {
  expect(TransactionUtilities.isNumber(1)).toBe(true);
});

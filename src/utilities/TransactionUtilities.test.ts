import TransactionUtilities from './TransactionUtilities';
import { tx, data } from '../../jest/sample/data'

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

describe('utilities test', (): void => {
  test('isNumber function test', (): void => {
    expect(TransactionUtilities.isNumber(1)).toBe(true);
    expect(TransactionUtilities.isNumber("p")).toBe(false);
  });

  test('getToken function test', (): void => {
    expect(TransactionUtilities.getToken(data.normalOutgoing)).toBe("ETH");
    expect(TransactionUtilities.getToken(data.normalIncoming)).toBe("ETH");
    expect(TransactionUtilities.getToken(data.normalSelf)).toBe("ETH");
    expect(TransactionUtilities.getToken(data.daiOutgoing)).toBe("DAI");
    expect(TransactionUtilities.getToken(data.cdaiOutgoing)).toBe("cDAI");
    expect(TransactionUtilities.getToken(data.compoundWithdraw)).toBe("DAI");
    expect(TransactionUtilities.getToken(data.compoundDeposit)).toBe("DAI");
  })

  test('getMethodName function test', (): void => {
    expect(TransactionUtilities.getMethodName(data.normalOutgoing)).toBe("Outgoing");
    expect(TransactionUtilities.getMethodName(data.normalIncoming)).toBe("Incoming");
    expect(TransactionUtilities.getMethodName(data.normalSelf)).toBe("Self");
    expect(TransactionUtilities.getMethodName(data.daiOutgoing)).toBe("Outgoing");
    expect(TransactionUtilities.getMethodName(data.cdaiOutgoing)).toBe("Outgoing");
    expect(TransactionUtilities.getMethodName(data.compoundWithdraw)).toBe("Withdraw");
    expect(TransactionUtilities.getMethodName(data.compoundDeposit)).toBe("Deposit");
    expect(TransactionUtilities.getMethodName(data.uniswap)).toBe("Swap");
  })

  test('getOption function test', (): void => {
    const noneOption = TransactionUtilities.getOption(data.normalOutgoing, "", "Outgoing")
    const swapOption = TransactionUtilities.getOption(data.uniswap, "Uniswap", "Swap")
    if (typeof noneOption == 'string') expect(noneOption).toBe("");
    else throw 'noneOption type is not correct'
    if (typeof swapOption == 'object') expect(JSON.stringify(swapOption)).toBe(JSON.stringify(TransactionUtilities.getSwapOption(data.uniswap)))
    else throw 'swapOption type is not correct'
  })
})

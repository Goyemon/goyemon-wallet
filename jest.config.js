module.exports = {
  preset: 'react-native',
  moduleDirectories: ['node_modules'],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(ts)$': '<rootDir>/node_modules/ts-jest'
  },
  moduleFileExtensions: ['js', 'ts', 'json'],
  moduleNameMapper: {
    '@react-native-firebase/*': '<rootDir>/jest/mocks/firebase/mock.js'
  }
};

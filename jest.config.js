module.exports = {
  moduleDirectories: ['node_modules'],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(ts)$': '<rootDir>/node_modules/ts-jest'
  },
  moduleFileExtensions: ['js', 'ts']
};

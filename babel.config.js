module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['@babel/plugin-transform-flow-strip-types'],
  env: {
    production: {
      plugins: ['@babel/plugin-proposal-class-properties']
    }
  }
};

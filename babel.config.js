module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    [
      'module-resolver',
      {
        alias: {
          'react-native-sqlite-storage': 'react-native-nitro-sqlite',
        },
      },
    ],
    //'react-native-reanimated/plugin',
    'babel-plugin-transform-typescript-metadata',
  ],
};

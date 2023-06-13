module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo', 
      'module:react-native-dotenv'
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '~/assets': './assets',
            '~/components': './components',
            '~/constants': './constants',
            '~/context': './context',
            '~/hooks': './hooks',
            '~/utils': './utils',
          },
        },
      ],
      require.resolve('expo-router/babel'),
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
    ],
  };
};

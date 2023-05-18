module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./app'],
          alias: {
            '~/assets': './assets',
            '~/components': './components',
            '~/context': './context',
            '~/hooks': './hooks',
          },
        },
      ],
      require.resolve('expo-router/babel'),
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
    ],
  };
};

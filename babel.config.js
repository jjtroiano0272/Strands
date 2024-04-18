module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
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
            '~/firebaseConfig': './firebaseConfig',
          },
        },
      ],
      // require.resolve('expo-router/babel'),
      // '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin', // MUST BE LISTED LAST
    ],
  };
};


module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  },
  rules: {
    'import/no-unresolved': [
      2,
      {
        ignore: [
          '^@/',
          '^umi/',
          'react',
          'antd',
          'redux',
          'js-cookie',
          'omit.js',
          'path-to-regexp',
          'moment',
        ],
      },
    ],
  },
};

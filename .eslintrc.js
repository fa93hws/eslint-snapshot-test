module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier',
  ],
  plugins: ['@typescript-eslint', 'import', 'jest'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },

  rules: {
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['tests/**/*.ts'],
      },
    ],
    'import/no-extraneous-dependencies': 'off',
    'import/no-dynamic-require': 'off',
    'import/extensions': [
      'error',
      {
        js: 'never',
        ts: 'never,',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-underscore-dangle': 'off',
    'global-require': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
  },
};

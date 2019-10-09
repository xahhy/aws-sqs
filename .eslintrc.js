module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-console': 0,
    'no-restricted-globals': 0,
    'max-classes-per-file': 0,
    'max-len': 0,
  },
  env: {
    jest: true,
  },
};

/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2023-05-15 14:21:20
 * @LastEditTime: 2023-05-15 16:51:53
 * @Author: liu yang
 */
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  globals: {
    defineEmits: true,
    document: true,
    localStorage: true,
    GLOBAL_VAR: true,
    window: true,
    defineProps: true,
    defineExpose: true
  },
  extends: ['./.eslintrc-auto-import.json', 'plugin:vue/vue3-recommended', 'airbnb-base', 'prettier', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['vue', 'import'],
  rules: {
    'no-console': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'prettier/prettier': 'error',
    'vue/multi-word-component-names': 'off',
    'import/order': 'off',
    'no-bitwise': 'off',
    'no-plusplus': 'off',
    'global-require': 'off',
    'no-use-before-define': 'off',
    'no-unused-expressions': 'off',
    'no-param-reassign': 'off',
    'prefer-const': 'off',
    'consistent-return': 'off',
    'no-nested-ternary': 'off',
    'no-return-assign': 'off',
    'array-callback-return': 'off'
  }
};

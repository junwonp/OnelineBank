// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const unusedImports = require('eslint-plugin-unused-imports');
const pluginQuery = require('@tanstack/eslint-plugin-query');
const reactCompiler = require('eslint-plugin-react-compiler');

/** @type {import('eslint').Linter.Config} */
const simpleImportSortConfig = {
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          [
            '^react(?!.*\\u0000$)',
            '^\\w(?!.*\\u0000$)',
            '^@?(?!.*\\u0000$)',
            '^\\u0000',
            '^react',
            '^\\w',
            '^@?',
          ],
          ['^@/(?!.*\\u0000$)', '^@/'],
          ['^\\.\\./(?!.*\\u0000$)', '^\\./(?!.*\\u0000$)', '^\\.\\./', '^\\./'],
          ['^'],
        ]
      },
    ],
    'simple-import-sort/exports': 'error',
  },
};

/** @type {import('eslint').Linter.Config} */
const unusedImportsConfig = {
  plugins: {
    'unused-imports': unusedImports,
  },
  rules: {
    'unused-imports/no-unused-imports': 'error',
  },
};

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      'node_modules/',
      '.expo/',
      'build/',
      'ios/',
      'android/',
      'web/',
      'dist/',
      'public/',
      '*.config.js',
      'expo-env.d.ts',
    ],
  },
  {
    rules: {
      'import/newline-after-import': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(useAnimatedStyle|useDerivedValue|useAnimatedProps)',
        },
      ],
      'react/jsx-no-leaked-render': 'error',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  simpleImportSortConfig,
  unusedImportsConfig,
  ...pluginQuery.configs['flat/recommended'],
  reactCompiler.configs.recommended,
]);

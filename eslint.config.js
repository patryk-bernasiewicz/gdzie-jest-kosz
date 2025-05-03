/**
 * @typedef {import('eslint').Linter.FlatConfig} FlatConfig
 * @typedef {import('@typescript-eslint/utils').TSESLint.Linter.Config} TSConfig
 */
import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactNativePlugin from 'eslint-plugin-react-native';

/** @type {Array<FlatConfig>} */
export default [
  eslint.configs.recommended,
  /** @type {FlatConfig} */
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-native': reactNativePlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      /** @type {Record<string, 'writable' | 'readonly' | 'off'>} */
      globals: {
        __DEV__: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        Promise: 'readonly',
        global: 'readonly',
        process: 'readonly',
        alert: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // ESLint rules
      'no-console': 'off',

      // React rules
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',

      // React hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Native rules
      'react-native/no-unused-styles': 'warn',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',

      // TypeScript rules
      'no-unused-vars': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // Prettier rules
      'prettier/prettier': 'error',
    },
  },
  /** @type {FlatConfig} */
  {
    files: ['**/__tests__/**/*', '**/*.spec.{js,jsx,ts,tsx}', '**/*.test.{js,jsx,ts,tsx}'],
    languageOptions: {
      /** @type {Record<string, 'writable' | 'readonly' | 'off'>} */
      globals: {
        jest: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        test: 'readonly',
      },
    },
  },
  /** @type {FlatConfig} */
  {
    ignores: [
      'node_modules/',
      '.expo/',
      '.expo-shared/',
      'web-build/',
      'dist/',
      'babel.config.js',
      'metro.config.js',
      'jest.config.js',
      'expo-env.d.ts',
      'scripts/reset-project.js',
      '**/__test__/**',
      '**/__tests__/**',
    ],
  },
];

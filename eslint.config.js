import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import vue from 'eslint-plugin-vue';

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.vue', '**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescript,
      'vue': vue
    },
    languageOptions: {
      parser: vue.parser,
      parserOptions: {
        parser: typescriptParser
      }
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...vue.configs.recommended.rules
    }
  }
];
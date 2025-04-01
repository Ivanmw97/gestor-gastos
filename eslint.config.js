import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import vueParser from 'vue-eslint-parser';

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node
      }
    }
  },
  {
    files: ['**/*.vue'],
    plugins: {
      'vue': vue
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: {
          ts: typescriptParser,
          js: 'espree',
          '<template>': 'espree'
        },
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: vue.configs.recommended?.rules || {}
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescript
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: typescript.configs.recommended?.rules || {}
  }
];
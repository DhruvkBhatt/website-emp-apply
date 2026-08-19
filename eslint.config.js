import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
  {
    // §2: a section may not import another section — keeps App.tsx the single
    // place the narrative order lives. App.tsx itself is exempt: importing every
    // section *is* its job.
    files: ['src/sections/**/*.tsx'],
    ignores: ['src/sections/**/*.test.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/sections/*', '../*/*', './*/*'],
              message:
                'A section may not import another section (PLAN §2). Lift shared code into components/ or hooks/.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/test/**/*.ts'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: { 'no-restricted-imports': 'off' },
  },
  {
    files: ['scripts/**/*.mjs', 'eslint.config.js', 'vite.config.ts'],
    languageOptions: { globals: globals.node },
  },
);

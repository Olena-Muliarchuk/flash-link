import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        ignores: ['dist/', 'node_modules/', 'package-lock.json', '.env', 'coverage/'],
    },

    eslint.configs.recommended,
    ...tseslint.configs.recommended,

    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
    },

    prettierConfig,

    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-console': 'off',
        },
    },
]);

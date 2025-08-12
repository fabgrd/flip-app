module.exports = {
    root: true,
    env: {
        es2021: true,
        node: true,
        jest: true,
        'react-native/react-native': true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: ['./tsconfig.json'],
            },
        },
    },
    plugins: [
        '@typescript-eslint',
        'react',
        'react-hooks',
        'react-native',
        'unused-imports',
        'prettier',
    ],
    extends: [
        'airbnb',
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react-native/all',
        'plugin:prettier/recommended',
        'prettier',
    ],
    rules: {
        // Prettier via ESLint
        'prettier/prettier': 'error',

        // Imports non utilisés
        'unused-imports/no-unused-imports': 'error',

        // Variables inutilisées (TS)
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
            'error',
            { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
        ],

        // Quotes / virgules finales / indentation
        quotes: ['error', 'single', { avoidEscape: true }],
        'comma-dangle': ['error', 'always-multiline'],
        indent: 'off', // confié à Prettier
        '@typescript-eslint/indent': 'off',

        // any explicite toléré en warning
        '@typescript-eslint/no-explicit-any': 'warn',

        // React / Hooks
        'react/react-in-jsx-scope': 'off',
        'react/jsx-filename-extension': [
            'error',
            { extensions: ['.jsx', '.tsx'] },
        ],
        'react/require-default-props': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // Import rules
        'import/prefer-default-export': 'off',
        'import/extensions': 'off',

        // TS specifics to limit noise in RN styles files
        '@typescript-eslint/no-use-before-define': 'off',

        // React Native (relax some opinionated rules)
        'react-native/no-inline-styles': 'off',
        'react-native/no-color-literals': 'off',
        'react-native/sort-styles': 'off',
        'react-native/no-unused-styles': 'off',
    },
    ignorePatterns: [
        'node_modules/',
        'dist/',
        'build/',
        '.expo/',
        'android/',
        'ios/',
        '**/*.d.ts',
    ],
}; 
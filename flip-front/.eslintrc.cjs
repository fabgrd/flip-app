module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    ecmaFeatures: { jsx: true },
  },
  plugins: [
    '@typescript-eslint',
    'unused-imports',
    'prettier',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  rules: {
    // Prettier
    'prettier/prettier': 'error',

    // Unused imports / variables
    'unused-imports/no-unused-imports': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],

    // Basic style
    quotes: ['error', 'single', { avoidEscape: true }],
    'comma-dangle': ['error', 'always-multiline'],
    semi: ['error', 'always'],

    // Heuristic anti-FR in string literals (outside i18n locales)
    'no-restricted-syntax': [
      'warn',
      {
        selector: "Literal[value][value=/[éèêëàâîïôöùûçÉÈÊËÀÂÎÏÔÖÙÛÇ]/u]",
        message: 'French accented characters detected in string literal. Move to i18n (EN) or remove.',
      },
      {
        selector: "Literal[value][value=/\\b(le|la|les|et|pour|avec|sans|déjà|joueur|jeu|réglages)\\b/i]",
        message: 'French word detected in string literal. Move to i18n (EN) or remove.',
      },
      {
        selector: "TemplateElement[value.raw=/[éèêëàâîïôöùûçÉÈÊËÀÂÎÏÔÖÙÛÇ]/u]",
        message: 'French accented characters detected in template literal. Move to i18n (EN) or remove.',
      },
    ],

    // Reduce noise
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-namespace': 'off',
  },
  overrides: [
    {
      files: ['src/i18n/locales/**/*', 'src/i18n/locales/**'],
      rules: {
        'no-restricted-syntax': 'off',
      },
    },
  ],
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
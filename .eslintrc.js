/* eslint-disable unicorn/prefer-module */
module.exports = {
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  extends: [
    'standard-with-typescript',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'sonarjs', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/ban-types': 'error',
    'consistent-return': 'error',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'error',
    'no-func-assign': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-unused-labels': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'unicorn/filename-case': [
      'error',
      {
        case: 'kebabCase',
        ignore: [/\$[A-Za-z]+\.tsx/]
      }
    ],
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/no-null': 'off',
    '@typescript-eslint/semi': ['off'],
    '@typescript-eslint/consistent-type-definitions': ['off'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'unicorn/no-new-array': 'off',
    'unicorn/import-style': 'off',
    'sonarjs/no-duplicate-string': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'sonarjs/cognitive-complexity': 'off',
    'unicorn/prefer-string-replace-all': 'off',
    '@typescript-eslint/return-await': 'off',
    'unicorn/prevent-abbreviations': 'off'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'prettier/prettier': [
          'error',
          {
            semi: false
          }
        ]
      }
    }
  ]
}

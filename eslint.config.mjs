import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'next'],
  }),
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // === React Rules ===
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-no-target-blank': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react/jsx-pascal-case': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // === TypeScript Rules ===
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/explicit-member-accessibility': [
        'warn',
        { accessibility: 'explicit' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-namespace': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-use-before-define': [
        'warn',
        { functions: false, classes: true, variables: true },
      ],
      '@typescript-eslint/member-ordering': [
        'warn',
        {
          default: [
            'signature',
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            'public-instance-field',
            'protected-instance-field',
            'private-instance-field',
            'constructor',
            'public-method',
            'protected-method',
            'private-method',
          ],
        },
      ],

      'no-unused-vars': 'off', // Disable the base JS rule
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_', // ignore _ prefixed args
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // === General JS Rules ===
      'no-const-assign': 'error',
      'no-unused-expressions': 'error',
      'no-empty-pattern': 'warn',
      'prefer-const': 'error',
      eqeqeq: 'error',
      'no-duplicate-imports': 'error',
      camelcase: 'warn',
      'consistent-return': 'warn',

      // === Code Style ===
      quotes: ['warn', 'single'],
      semi: ['warn', 'never'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]

export default eslintConfig

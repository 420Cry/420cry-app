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
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      'no-const-assign': 'error',
      'no-unused-expressions': 'error',
      'no-console': 'warn',

      // TypeScript-specific rules
      '@typescript-eslint/explicit-member-accessibility': [
        'warn',
        { accessibility: 'explicit' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-namespace': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
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

      // React-specific rules
      'react/jsx-no-target-blank': 'warn',
      'react/no-unescaped-entities': 'warn',

      // Prevent common bugs and improve code readability
      'no-unused-vars': 'warn',
      'no-empty-pattern': 'warn',

      // Miscellaneous rules
      'prefer-const': 'error',
      eqeqeq: 'error',
      'no-duplicate-imports': 'error',
      camelcase: 'warn',
      'consistent-return': 'warn',

      // Prevent unintentional re-renders
      'react/jsx-pascal-case': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Code style
      quotes: ['warn', 'single'],
      semi: ['warn', 'never'],
    },
  },
]

export default eslintConfig

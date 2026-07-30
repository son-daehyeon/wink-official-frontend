import { fixupPluginRules } from '@eslint/compat';
import eslint from '@eslint/js';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettierConfig from 'eslint-config-prettier';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

const legacyRuleApiPlugins = new Set(['react', 'react-hooks', 'import', 'jsx-a11y']);
const nextCompat = nextVitals.map((config) => ({
  ...config,
  plugins: Object.fromEntries(
    Object.entries(config.plugins ?? {}).map(([name, plugin]) => [
      name,
      legacyRuleApiPlugins.has(name) ? fixupPluginRules(plugin) : plugin,
    ]),
  ),
}));

const legacyAliases = [
  '@/api',
  '@/api/**',
  '@/component',
  '@/component/**',
  '@/contracts',
  '@/contracts/**',
  '@/guard',
  '@/guard/**',
  '@/hook',
  '@/hook/**',
  '@/lib',
  '@/lib/**',
  '@/store',
  '@/store/**',
  '@/style',
  '@/style/**',
];

const entityPrivateEntries = [
  '@/entities/*/api/**',
  '@/entities/*/model/**',
  '@/entities/*/ui/**',
  '@/entities/*/@x/**',
];
const featurePrivateEntries = [
  '@/features/*/api/**',
  '@/features/*/model/**',
  '@/features/*/ui/**',
];
const widgetPrivateEntries = ['@/widgets/*/api/**', '@/widgets/*/model/**', '@/widgets/*/ui/**'];

const restrictedImports = (...patterns) => [
  'error',
  {
    patterns: [
      {
        group: legacyAliases,
        message: 'Import through the matching FSD layer public API.',
      },
      ...patterns,
    ],
  },
];

export default tseslint.config(
  {
    ignores: ['src/shared/api/generated/openapi.d.ts'],
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    extends: [
      eslint.configs.recommended,
      ...nextCompat,
      ...tseslint.configs.recommended,
      ...tanstackQuery.configs['flat/recommended'],
      prettierRecommended,
    ],
    rules: {
      ...prettierConfig.rules,
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'with-single-extends',
        },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'react/jsx-key': 'warn',
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
      '@next/next/no-page-custom-font': 'off',
      'no-console': 'warn',
      'no-restricted-imports': restrictedImports(),
    },
  },
  {
    files: ['src/shared/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictedImports({
        group: ['@/entities/**', '@/features/**', '@/widgets/**', '@/app/**'],
        message: 'shared can only depend on shared code and external packages.',
      }),
    },
  },
  {
    files: ['src/entities/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictedImports(
        {
          group: ['@/features/**', '@/widgets/**', '@/app/**'],
          message: 'entities can only depend on shared and lower-level entity contracts.',
        },
        {
          regex: '^@/entities/[^/]+$',
          message: 'Use an explicit @x entry across entity slices.',
        },
        {
          group: ['@/entities/*/api/**', '@/entities/*/model/**', '@/entities/*/ui/**'],
          message: 'Use a relative import inside a slice and an explicit @x entry across entities.',
        },
      ),
    },
  },
  {
    files: ['src/features/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictedImports(
        {
          group: ['@/widgets/**', '@/app/**'],
          message: 'features can only depend on entities and shared.',
        },
        {
          group: ['@/features/**'],
          message:
            'Feature slices must not depend on other feature slices; use relative imports within a slice.',
        },
        {
          group: entityPrivateEntries,
          message: 'Import entities through their slice public API.',
        },
      ),
    },
  },
  {
    files: ['src/widgets/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictedImports(
        {
          group: ['@/app/**'],
          message: 'widgets cannot depend on pages or application composition.',
        },
        {
          group: ['@/widgets/**'],
          message:
            'Widget slices must use relative internal imports and must not depend on peer widgets.',
        },
        {
          group: [...featurePrivateEntries, ...entityPrivateEntries],
          message: 'Import feature and entity slices through their public APIs.',
        },
      ),
    },
  },
  {
    files: ['src/app/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictedImports(
        {
          group: ['@/app/**'],
          message: 'Use relative imports within the app route tree.',
        },
        {
          group: [...featurePrivateEntries, ...entityPrivateEntries, ...widgetPrivateEntries],
          message: 'Import lower-layer slices through their public APIs.',
        },
      ),
    },
  },
);

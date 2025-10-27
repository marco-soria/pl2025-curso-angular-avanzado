import type { Config } from 'jest';

export default {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '@shared/(.*)': '<rootDir>/src/app/domains/shared/$1',
    '@products/(.*)': '<rootDir>/src/app/domains/products/$1',
    '@info/(.*)': '<rootDir>/src/app/domains/info/$1',
    '@env/(.*)': '<rootDir>/src/environments/$1',
  },
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!<rootDir>/node_modules/',
    '!<rootDir>/test/',
  ],

  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  maxWorkers: 1,
} satisfies Config;

export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '^@heroicons/react/24/outline$': '<rootDir>/__mocks__/heroicons.tsx',
      '^@google/genai$': '<rootDir>/__mocks__/google-genai.ts',
    },
    transform: {
      '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  };
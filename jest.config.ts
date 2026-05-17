import type { Config } from 'jest';

const config: Config = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
    roots: ['<rootDir>/apps/', '<rootDir>/libs/'],
    moduleNameMapper: {
        '^@common-platform/common(|/.*)$': '<rootDir>/libs/common/src/$1',
        '^@common-platform/database(|/.*)$': '<rootDir>/libs/database/src/$1',
        '^@common-platform/queue(|/.*)$': '<rootDir>/libs/queue/src/$1',
        '^@common-platform/storage(|/.*)$': '<rootDir>/libs/storage/src/$1',
    },
};

export default config;
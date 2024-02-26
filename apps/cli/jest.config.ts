// Sync object
const config = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@modules(.*)$': '<rootDir>/src/modules$1',
        '^@lib(.*)$': '<rootDir>/src/lib$1',
        '^@constants(.*)$': '<rootDir>/src/constants$1',
    },
    reporters: ['default', 'jest-junit'],
    coveragePathIgnorePatterns: ['<rootDir>/src/modules/canvas_api/api.ts'],
}
export default config

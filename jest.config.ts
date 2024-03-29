/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import type { Config } from 'jest'

const config: Config = {
  clearMocks: true,
  testEnvironment: "jsdom",
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFiles: ["<rootDir>/setup_tests.ts", "fake-indexeddb/auto"],
}

export default config

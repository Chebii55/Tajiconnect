/**
 * MSW Server Configuration
 *
 * Sets up the MSW server for intercepting API requests during tests.
 */

import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * MSW server instance
 * Used in setup.ts to start/stop the server for tests
 */
export const server = setupServer(...handlers)

export default server

import { setupServer } from 'msw/node'
import { handlers } from '../mocks/handlers'
import { beforeAll, afterAll, afterEach } from 'vitest'

const server = setupServer(...handlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())

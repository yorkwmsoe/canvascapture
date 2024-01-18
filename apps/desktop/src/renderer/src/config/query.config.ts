import { QueryClient } from '@tanstack/react-query'

export const queryConfig = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false
    }
  }
})

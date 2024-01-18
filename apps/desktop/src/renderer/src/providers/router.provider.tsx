import { routeTree } from '@renderer/routes/root.route'
import {
  Router,
  RouterProvider as TanstackRouterProvider,
  createMemoryHistory
} from '@tanstack/react-router'

// !MUST NOT BE BROWSER HISTORY FOR ELECTRON
const history = createMemoryHistory({
  initialEntries: import.meta.env.RENDERER_VITE_MODE === 'demo' ? ['/demo'] : ['/']
})

const router = new Router({ routeTree, history })

// Updates the router typesript definitions
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function RouterProvider() {
  return <TanstackRouterProvider router={router} />
}

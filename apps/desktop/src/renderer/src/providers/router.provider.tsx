/**
 * Defines the RouterProvider and related helper functions
 *
 * See the individual definitions below for more details
 */
import { routeTree } from '@renderer/routes/root.route'
import {
    RouterProvider as TanstackRouterProvider,
    createMemoryHistory,
    createRouter,
} from '@tanstack/react-router'

// !MUST NOT BE BROWSER HISTORY FOR ELECTRON
const history = createMemoryHistory({
    initialEntries:
        import.meta.env.RENDERER_VITE_MODE === 'demo' ? ['/demo'] : ['/'],
})

const router = createRouter({ routeTree, history })

// Updates the router typesript definitions
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

export function RouterProvider() {
    return <TanstackRouterProvider router={router} />
}

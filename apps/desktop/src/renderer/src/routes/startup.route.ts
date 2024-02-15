import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root.route'
import { StartupPage } from '@renderer/pages/StartupPage'

export const startupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/startup',
    component: StartupPage,
})

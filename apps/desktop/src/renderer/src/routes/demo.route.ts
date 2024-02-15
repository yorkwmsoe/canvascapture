import { DemoPage } from '@renderer/pages/DemoPage'
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root.route'

export const demoRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/demo',
    component: DemoPage,
})

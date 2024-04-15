import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root.route'
import { SettingsPage } from '@renderer/pages/SettingsPage'

export const setupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/setup',
    component: SettingsPage,
})

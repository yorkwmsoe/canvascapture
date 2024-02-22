import { SettingsPage } from '@renderer/pages/SettingsPage'
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root.route'

export const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: SettingsPage,
})

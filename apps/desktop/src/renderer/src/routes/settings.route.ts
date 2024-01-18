import { SettingsPage } from '@renderer/pages/SettingsPage'
import { Route } from '@tanstack/react-router'
import { rootRoute } from './root.route'

export const settingsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage
})

import { Route } from '@tanstack/react-router'
import { rootRoute } from './root.route'
import { StartupPage } from '@renderer/pages/StartupPage'

export const startupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/startup',
  component: StartupPage
})

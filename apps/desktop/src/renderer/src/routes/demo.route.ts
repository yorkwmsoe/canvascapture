import { DemoPage } from '@renderer/pages/DemoPage'
import { Route } from '@tanstack/react-router'
import { rootRoute } from './root.route'

export const demoRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/demo',
  component: DemoPage
})

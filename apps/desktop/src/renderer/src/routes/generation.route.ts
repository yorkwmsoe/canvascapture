import { GenerationPage } from '@renderer/pages/GenerationPage'
import { Route } from '@tanstack/react-router'
import { rootRoute } from './root.route'

export const generationRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/generation',
  component: GenerationPage
})

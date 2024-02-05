import { GenerationPage } from '@renderer/pages/GenerationPage'
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root.route'

export const generationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/generation',
  component: GenerationPage
})

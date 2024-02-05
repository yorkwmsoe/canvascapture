import { SelectionPage } from '@renderer/pages/SelectionPage'
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root.route'

export const selectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/selection',
  component: SelectionPage
})

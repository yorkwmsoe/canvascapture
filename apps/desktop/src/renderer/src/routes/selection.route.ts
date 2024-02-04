import { SelectionPage } from '@renderer/pages/SelectionPage'
import { createRoute } from '@tanstack/react-router'
import { homeRoute } from './home.route'

export const selectionRoute = createRoute({
  getParentRoute: () => homeRoute,
  path: '/selection',
  component: SelectionPage
})

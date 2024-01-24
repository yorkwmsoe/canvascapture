import { SelectionPage } from '@renderer/pages/SelectionPage'
import { Route } from '@tanstack/react-router'
import { homeRoute } from './home.route'

export const selectionRoute = new Route({
  getParentRoute: () => homeRoute,
  path: '/selection',
  component: SelectionPage
})

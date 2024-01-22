import { Route } from '@tanstack/react-router'
import { rootRoute } from './root.route'
import { HomePage } from '@renderer/pages/HomePage'

export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
})

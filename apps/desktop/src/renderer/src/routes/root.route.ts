import { RootRoute } from '@tanstack/react-router'
import { homeRoute } from './home.route'
import { startupRoute } from './startup.route'
import { settingsRoute } from './settings.route'
import { generationRoute } from './generation.route'
import { demoRoute } from './demo.route'

export const rootRoute = new RootRoute()

export const routeTree = rootRoute.addChildren([
  homeRoute,
  startupRoute,
  settingsRoute,
  generationRoute,
  demoRoute
  // Add your routes here
])

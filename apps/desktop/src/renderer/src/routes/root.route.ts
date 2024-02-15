import { createRootRoute } from '@tanstack/react-router'
import { homeRoute } from './home.route'
import { startupRoute } from './startup.route'
import { settingsRoute } from './settings.route'
import { generationRoute } from './generation.route'
import { demoRoute } from './demo.route'
import { selectionRoute } from './selection.route'

export const rootRoute = createRootRoute()

export const routeTree = rootRoute.addChildren([
    homeRoute,
    startupRoute,
    settingsRoute,
    generationRoute,
    demoRoute,
    selectionRoute,
    // Add your routes here
])

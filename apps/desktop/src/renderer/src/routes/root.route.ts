import { createRootRoute } from '@tanstack/react-router'
import { homeRoute } from './home.route'
import { setupRoute } from './setup.route'
import { settingsRoute } from './settings.route'
import { demoRoute } from './demo.route'
import { selectionRoute } from './selection.route'
import { markdownEditorRoute } from './markdown-editor.route'

export const rootRoute = createRootRoute()

export const routeTree = rootRoute.addChildren([
    homeRoute,
    setupRoute,
    settingsRoute,
    demoRoute,
    selectionRoute,
    markdownEditorRoute,
    // Add your routes here
])

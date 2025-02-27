/**
 * Defines the rootRoute and the routeTree
 *
 * See the individual definitions below for more details
 */
import { createRootRoute } from '@tanstack/react-router'
import { homeRoute } from './home.route'
import { setupRoute } from './setup.route'
import { settingsRoute } from './settings.route'
import { selectionRoute } from './selection.route'
import { markdownEditorRoute } from './markdown-editor.route'
import { generationRoute } from '@renderer/routes/generation.route'
import { helpRoute } from '@renderer/routes/help.route'

export const rootRoute = createRootRoute()

export const routeTree = rootRoute.addChildren([
    homeRoute,
    setupRoute,
    settingsRoute,
    selectionRoute,
    markdownEditorRoute,
    generationRoute,
    helpRoute,
    // Add your routes here
])

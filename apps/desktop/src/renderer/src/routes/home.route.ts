/**
 * Defines the homeRoute
 *
 * See the definition below for more details
 */
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root.route'
import { HomePage } from '@renderer/pages/HomePage'

export const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
})

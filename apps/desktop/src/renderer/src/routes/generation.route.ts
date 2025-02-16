/**
 * Defines the generationRoute
 *
 * See the definition below for more details
 */
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root.route'
import { MarkdownEditorPage } from '@renderer/pages/MarkdownEditorPage'

export const generationRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/generation',
    component: MarkdownEditorPage,
})

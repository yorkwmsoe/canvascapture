import { MarkdownEditorPage } from '@renderer/pages/MarkdownEditorPage'
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root.route'

export const markdownEditorRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/markdown-editor',
    component: MarkdownEditorPage,
})

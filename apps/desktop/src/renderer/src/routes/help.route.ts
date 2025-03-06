/**
 * Defines the helpRoute
 *
 * See the definition below for more details
 */
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root.route'
import { HelpPage } from '@renderer/pages/HelpPage'
import { z } from 'zod'

const searchSchema = z.object({
    previousPage: z.string(),
    section: z.string().optional(),
    step: z.number().optional(),
})

export const helpRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/help',
    component: HelpPage,
    validateSearch: searchSchema,
})

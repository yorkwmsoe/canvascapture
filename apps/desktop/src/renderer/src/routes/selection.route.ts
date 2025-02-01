/**
 * Defines the selectionRoute and a related helper function
 *
 * See the individual definitions below for more details
 */
import { SelectionPage } from '@renderer/pages/SelectionPage'
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root.route'
import { z } from 'zod'

const searchSchema = z.object({
    step: z.number().optional(),
})

export const selectionRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/selection',
    component: SelectionPage,
    validateSearch: searchSchema,
})

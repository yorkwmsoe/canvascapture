import { DemoPage } from '@renderer/pages/DemoPage'
import { Route } from '@tanstack/react-router'
import { rootRoute } from './root.route'
import {SelectionPage} from "../pages/SelectionPage";

export const demoRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/demo',
  component: SelectionPage
})

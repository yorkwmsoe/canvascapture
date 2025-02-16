/**
 * Defines the basic structure of the app
 *
 * See the definition below for more details
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from './providers/theme.provider'
import { RouterProvider } from './providers/router.provider'
import { QueryProvider } from './providers/query.provider'
import { App } from 'antd'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryProvider>
            <ThemeProvider>
                <App style={{ height: '100%' }}>
                    <RouterProvider />
                </App>
            </ThemeProvider>
        </QueryProvider>
    </React.StrictMode>
)

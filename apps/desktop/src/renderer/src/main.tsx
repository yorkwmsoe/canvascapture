import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from './providers/theme.provider'
import { RouterProvider } from './providers/router.provider'
import { QueryProvider } from './providers/query.provider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryProvider>
            <ThemeProvider>
                <RouterProvider />
            </ThemeProvider>
        </QueryProvider>
    </React.StrictMode>
)

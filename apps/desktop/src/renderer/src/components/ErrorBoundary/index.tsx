/**
 * Defines the ErrorBoundary react component
 * Used to catch and hide errors
 *
 * See below for more details
 */
import { Component } from 'react'
import { message } from 'antd'

interface ErrorBoundaryProps {
    children: React.ReactNode
}

export class ErrorBoundary extends Component<ErrorBoundaryProps> {
    state = {
        hasError: false,
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    render() {
        if (this.state.hasError) {
            message.destroy()
            message.error('An error occurred')
        }

        return this.props.children
    }
}

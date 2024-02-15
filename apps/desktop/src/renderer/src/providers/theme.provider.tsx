import { themeConfig } from '@renderer/config/theme.config'
import { ConfigProvider } from 'antd'

export type ThemeProviderProps = {
    children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
}

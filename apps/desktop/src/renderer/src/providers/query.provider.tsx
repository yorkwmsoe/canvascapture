import { store } from '@renderer/apis/store'
import { Provider } from 'react-redux'

export type QueryProviderProps = {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  return <Provider store={store}>{children}</Provider>
}

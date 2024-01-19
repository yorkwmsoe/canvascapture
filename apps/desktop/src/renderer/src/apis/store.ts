import { configureStore } from '@reduxjs/toolkit'
import { randomDataApi } from './random.api'
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
  reducer: {
    [randomDataApi.reducerPath]: randomDataApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(randomDataApi.middleware)
})

setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

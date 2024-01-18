export async function toJSON(value: Response) {
  return await value.json()
}

export function throwOnError(value: Response) {
  if (!value.ok) {
    throw new Error(value.statusText)
  }
  return value
}

export function createApi(basePath: string) {
  return {
    get: async <Res>(path: string, init?: RequestInit) =>
      await baseApi<Res>(basePath + path, { ...init, method: 'GET' }),
    post: async <Res>(path: string, init?: RequestInit) =>
      await baseApi<Res>(basePath + path, { ...init, method: 'POST' }),
    put: async <Res>(path: string, init?: RequestInit) =>
      await baseApi<Res>(basePath + path, { ...init, method: 'PUT' }),
    delete: async <Res>(path: string, init?: RequestInit) =>
      await baseApi<Res>(basePath + path, { ...init, method: 'DELETE' })
  }
}

async function baseApi<Res>(path: string, init?: RequestInit) {
  return await fetch(path, {
    ...init,
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json'
    }
  })
    .then(throwOnError)
    .then<Res>(toJSON)
}

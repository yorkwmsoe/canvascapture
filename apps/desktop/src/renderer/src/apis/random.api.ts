import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { CreditCard, CreditCardReponse } from '@renderer/types/random.api.types'

// Define a service using a base URL and expected endpoints
export const randomDataApi = createApi({
  reducerPath: 'random-data-api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://random-data-api.com/api/v2/' }),
  endpoints: (builder) => ({
    getRandomCreditCard: builder.query<CreditCard, void>({
      query: () => 'credit_cards', // https://random-data-api.com/api/v2/credit_cards
      transformResponse: (response: CreditCardReponse) => {
        return {
          id: response.id,
          uid: response.uid,
          creditCardBalance: Math.random() * 99999,
          creditCardNumber: response.credit_card_number,
          creditCardExpiryDate: response.credit_card_expiry_date,
          creditCardType: response.credit_card_type
        }
      }
    })
  })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetRandomCreditCardQuery } = randomDataApi

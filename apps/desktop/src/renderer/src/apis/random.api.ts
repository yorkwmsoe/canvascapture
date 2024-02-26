import {
    CreditCard,
    CreditCardResponse,
} from '@renderer/types/random.api.types'
import { useQuery } from '@tanstack/react-query'

const baseUrl = 'https://random-data-api.com/api'

export const useGetRandomCreditCardQuery = () => {
    return useQuery<CreditCard, Error>({
        queryKey: ['random-credit-card'],
        queryFn: async () => {
            const response = await fetch(`${baseUrl}/v2/credit_cards`)
            const data = (await response.json()) as CreditCardResponse
            return {
                id: data.id,
                uid: data.uid,
                creditCardBalance: Math.random() * 99999,
                creditCardNumber: data.credit_card_number,
                creditCardExpiryDate: data.credit_card_expiry_date,
                creditCardType: data.credit_card_type,
            }
        },
    })
}

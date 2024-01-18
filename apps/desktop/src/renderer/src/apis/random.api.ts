import { CreditCard, CreditCardReponse } from '@renderer/types/random.api.types'
import { createApi } from '@renderer/utils/api.utils'

const randomApi = createApi('https://random-data-api.com/api/v2')

export async function getRandomCreditCard(): Promise<CreditCard> {
  const data = await randomApi.get<CreditCardReponse>('/credit_cards')
  return {
    id: data.id,
    uid: data.uid,
    creditCardBalance: Math.floor(Math.random() * 99999),
    creditCardNumber: data.credit_card_number,
    creditCardExpiryDate: new Date(data.credit_card_expiry_date),
    creditCardType: data.credit_card_type
  }
}

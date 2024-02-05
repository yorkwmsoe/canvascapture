export type CreditCardResponse = {
  id: number
  uid: string
  credit_card_number: string
  credit_card_expiry_date: string
  credit_card_type: string
}

export type CreditCard = {
  id: number
  uid: string
  creditCardBalance: number
  creditCardNumber: string
  creditCardExpiryDate: string
  creditCardType: string
}

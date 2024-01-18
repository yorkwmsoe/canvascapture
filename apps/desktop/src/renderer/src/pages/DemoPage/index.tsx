import { getRandomCreditCard } from '@renderer/apis/random.api'
import { CreditCardDemo } from '@renderer/components/CreditCardDemo'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'antd'

export function DemoPage() {
  const { data, refetch } = useQuery({
    queryKey: ['credit-card'],
    queryFn: getRandomCreditCard
  })

  return (
    <div>
      <h1>Demo Page</h1>
      <div style={{ marginBlock: '1rem' }}>
        <Button type="primary" onClick={() => refetch()}>
          Regenerate
        </Button>
      </div>
      {data && <CreditCardDemo creditCard={data} />}
    </div>
  )
}

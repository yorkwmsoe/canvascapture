import { useGetRandomCreditCardQuery } from '@renderer/apis/random.api'
import { CreditCardDemo } from '@renderer/components/CreditCardDemo'
import { Button } from 'antd'

export function DemoPage() {
    const { data, isFetching, refetch } = useGetRandomCreditCardQuery()
    return (
        <div>
            <h1>Demo Page</h1>
            <div style={{ marginBlock: '1rem' }}>
                <Button type="primary" onClick={() => refetch()}>
                    Regenerate
                </Button>
            </div>
            {<CreditCardDemo creditCard={data} loading={isFetching} />}
        </div>
    )
}

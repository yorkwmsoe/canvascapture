import { CreditCard } from '@renderer/types/random.api.types'
import { Card, Flex, Skeleton, Space, Statistic, Typography } from 'antd'
import { useTheme } from '@renderer/lib/useTheme'
import { CreditCardTapToPayIcon } from '../icons/CreditCardTapToPayIcon'

export type CreditCardDemoProps = {
  creditCard: CreditCard | undefined
  loading?: boolean
}

export function CreditCardDemo({ creditCard, loading }: CreditCardDemoProps) {
  const { token } = useTheme()
  return (
    <Card
      bordered={false}
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        width: '25rem',
        height: '13rem'
      }}
      bodyStyle={{
        height: '100%'
      }}
    >
      <Flex vertical justify="space-between" style={{ height: '100%' }}>
        <Flex justify="space-between" align="center" style={{ fontSize: '32px' }}>
          {loading ? (
            <Skeleton.Input />
          ) : (
            <Typography.Title level={4} style={{ margin: 0 }}>
              {creditCard?.creditCardType.replaceAll('_', ' ').toUpperCase()}
            </Typography.Title>
          )}
          <CreditCardTapToPayIcon />
        </Flex>
        <Space direction="vertical">
          <Flex vertical>
            <Typography.Text style={{ fontSize: '12px' }}>Balance</Typography.Text>
            {loading ? (
              <Skeleton.Input size="large" />
            ) : (
              <Statistic
                value={creditCard?.creditCardBalance}
                prefix={'$'}
                precision={2}
                style={{
                  borderBottom: `1px solid ${token.colorBorder}`
                }}
              />
            )}
          </Flex>
          <Flex justify="space-between" style={{ fontSize: '11px' }}>
            {loading ? (
              <>
                <Skeleton.Input size="small" />
                <Skeleton.Input size="small" />
              </>
            ) : (
              <>
                <Typography.Text
                  copyable={{ text: creditCard?.creditCardNumber.split('-').join('') }}
                >
                  {`****-****-****-${creditCard?.creditCardNumber.slice(-4)}`}
                </Typography.Text>
                <Typography.Text>
                  {new Date(creditCard?.creditCardExpiryDate ?? '').toLocaleDateString(undefined, {
                    month: '2-digit',
                    year: '2-digit'
                  })}
                </Typography.Text>
              </>
            )}
          </Flex>
        </Space>
      </Flex>
    </Card>
  )
}

import { CreditCard } from '@renderer/types/random.api.types'
import { Card, Flex, Space, Statistic, Typography } from 'antd'
import { useTheme } from '@renderer/lib/useTheme'
import { CreditCardTapToPayIcon } from '../icons/CreditCardTapToPayIcon'

export type CreditCardDemoProps = {
  creditCard: CreditCard
}

export function CreditCardDemo({ creditCard }: CreditCardDemoProps) {
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
        <Flex justify="space-between" align="flex-start" style={{ fontSize: '32px' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {creditCard.creditCardType.replaceAll('_', ' ').toUpperCase()}
          </Typography.Title>
          <CreditCardTapToPayIcon />
        </Flex>
        <Space direction="vertical">
          <Statistic
            title="Balance"
            value={creditCard.creditCardBalance}
            prefix={'$'}
            style={{
              borderBottom: `1px solid ${token.colorBorder}`
            }}
          />
          <Flex justify="space-between">
            <Typography.Text
              copyable={{ text: creditCard.creditCardNumber.split('-').join('') }}
              style={{ fontSize: '11px' }}
            >
              {`****-****-****-${creditCard.creditCardNumber.slice(-4)}`}
            </Typography.Text>
            <Typography.Text style={{ fontSize: '11px' }}>
              {creditCard.creditCardExpiryDate.toLocaleDateString(undefined, {
                month: '2-digit',
                year: '2-digit'
              })}
            </Typography.Text>
          </Flex>
        </Space>
      </Flex>
    </Card>
  )
}

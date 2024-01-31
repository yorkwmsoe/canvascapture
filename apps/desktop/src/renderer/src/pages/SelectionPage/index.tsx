import { Button, Card, Flex, Steps, theme, Skeleton, Space, Statistic, Typography } from 'antd'
import { useState } from 'react'
import SwitchStepper, { box } from '../../components/SwitchStepper'
import { step } from '../../components/SwitchStepper'
export function SelectionPage() {
  const steps: step[] = [
    {
      title: 'Select Courses',
      stage: 'Course'
    },
    {
      title: 'Select Assignments',
      stage: 'Assign'
    },
    {
      title: 'Generate',
      stage: 'Gen'
    }
  ]

  return (
    <div>
      <SwitchStepper steps={steps}></SwitchStepper>
    </div>
  )
}

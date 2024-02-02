import React, { useRef, useState } from 'react'
import { Button, message, Steps, theme } from 'antd'
import Courses from '../Courses'
import { Assignments } from '../Assignments'
import { useCheckStore } from '../../stores/check.store'

export type box = {
  title: string
  isChecked: boolean
  children: undefined | box[]
}

export type step = {
  title: string
  stage: string
}

function SwitchStepper({ steps }: { steps: step[] }) {
  const { token } = theme.useToken()
  const [current, setCurrent] = useState(0)
  const stage = useRef('Courses')
  const { courseCheck, setCourseCheck } = useCheckStore()

  // console.log(steps[current].children)
  // console.log("redone", steps[current].children.map(item => item.title))
  const next = () => {
    if (courseCheck) {
      setCurrent(current + 1)
      checkStage()
    }
  }

  const checkStage = () => {
    if (current == 1) {
      stage.current = 'Courses'
    } else if (current == 2) {
      stage.current = 'Assignments'
    } else {
      stage.current = 'Generation'
    }
  }

  const prev = () => {
    checkStage()
    setCurrent(current - 1)
  }

  const items = steps.map((item) => ({ key: item.title, title: item.title }))

  const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16
  }

  return (
    <>
      <Steps current={current} items={items} />
      <div style={contentStyle}>
        {/*steps[current].content*/}
        {current === steps.length - 3 && <Courses />}
        {current === steps.length - 1 && <h1>Generating</h1>}
        {current === steps.length - 2 && <Assignments />}
        {/*stage === "Course" ? <Checkbox.Group options={steps[current].content.map(item =>  item.name)} onChange={onChange}/> :
        <TreeView></TreeView>*/}
      </div>
      <div style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </>
  )
}

export default SwitchStepper

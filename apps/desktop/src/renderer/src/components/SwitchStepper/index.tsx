import React, { useState } from 'react';
import {Button, Checkbox, GetProp, message, Steps, theme} from 'antd';
import TreeView from '../TreeView';


export type stepItem = {
  title: string,
  content: box[],
}

export type box = {
  name: string,
  isChecked: boolean
}

function SwitchStepper({ steps }: { steps: stepItem[] }) {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [stage, setStage] =useState('Courses')


  console.log("redone", steps[current].content.map(item =>  item.name))
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    //console.log('checked = ', checkedValues);
    if(stage === 'Courses'){
      steps[0].content.forEach(item => {
        if(checkedValues.includes(item.name)){
          item.isChecked = true;
        } else {
          item.isChecked = false;
        }
      })
    }
    console.log(steps)

  };

  const getCheckedBoxes = (givenList: stepItem[]) => {

  }

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };


  return (
    <>
      <Steps current={current} items={items} />
      <div style={contentStyle}>
        {/*steps[current].content*/}
        {stage === "Course" ? <Checkbox.Group options={steps[current].content.map(item =>  item.name)} onChange={onChange}/> :
        <TreeView></TreeView>}
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
  );
};

export default SwitchStepper;

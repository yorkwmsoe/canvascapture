import { Button, Card, Flex, Steps, theme, Skeleton, Space, Statistic, Typography } from 'antd'
import {useState} from "react";
import SwitchStepper from "../../components/SwitchStepper";
import {stepItem} from "../../components/SwitchStepper";
export function SelectionPage() {


  const steps: stepItem[] = [
    {
      title: 'Select Courses',
      content: [
        { name: 'Math', isChecked: false },
        { name: 'Science', isChecked: false },
        { name: 'English', isChecked: false },
        { name: 'Language', isChecked: false }
      ],
    },
    {
      title: 'Select Assignments',
      content: [],
    },
    {
      title: 'Generate',
      content: [
        { name: 'orange', isChecked: false },
        { name: 'banana', isChecked: false },
        { name: 'muffin', isChecked: false },
        { name: 'kiwi', isChecked: false }
      ],
    },
  ];



  return (
    <div>
      <SwitchStepper steps={steps}></SwitchStepper>
    </div>
  )
}

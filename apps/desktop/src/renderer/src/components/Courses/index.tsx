import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Checkbox, CheckboxProps, GetProp} from 'antd'
import { useGenerationStore } from '../../stores/generation.store'
import { useGetCourses } from '../../apis/canvas.api'
import {useCheckStore} from "../../stores/check.store";


function Courses() {
  const { courses, setCourses } = useGenerationStore()
  const { data } = useGetCourses();
  const {courseCheck, setCourseCheck} = useCheckStore()

    const onChange: GetProp<typeof Checkbox.Group<number>, 'onChange'> = useCallback(
    (checkedValues) => {
        if(checkedValues.length == 0){
            setCourseCheck(false);
        } else {
            setCourseCheck(true)
        }
      setCourses(checkedValues)
    },
    [setCourses]
  )

  return (
    <>
      <Checkbox.Group
        options={data?.map((course) => ({
          label: course.name,
          value: course.id,
        }))}
        onChange={onChange}
      />
    </>
  )
}

export default Courses

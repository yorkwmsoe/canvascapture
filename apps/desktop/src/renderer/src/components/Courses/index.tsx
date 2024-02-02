import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Checkbox, CheckboxProps, GetProp} from 'antd'
import { useGenerationStore } from '../../stores/generation.store'
import { useGetCourses } from '../../apis/canvas.api'
import {useCheckStore} from "../../stores/check.store";

type CourseInfo = {
    id: number,
    name: string,
    checked: boolean
}

function Courses() {
  const { courses, setCourses } = useGenerationStore()
  const { data } = useGetCourses();
  const {courseCheck, setCourseCheck} = useCheckStore()
    const coursesInfo = useRef<CourseInfo[]>([])


    const populateCourseInfo = () => {
      data?.map((course) => {
          coursesInfo.current.push({
            id: course.id,
            name: course.name,
            checked: courses.includes(course.id),
          })
      })
    }
    populateCourseInfo()


    // const onChange: GetProp<typeof Checkbox.Group<number>, 'onChange'> = useCallback(
  //   (checkedValues) => {
  //       if(checkedValues.length == 0){
  //           setCourseCheck(false);
  //       } else {
  //           setCourseCheck(true)
  //       }
  //     setCourses(checkedValues)
  //   },
  //   [setCourses]
  // )

    const onChange: CheckboxProps['onChange'] = (e) => {
      console.log(e.target.checked, "\t", e.target.label)
      if(e.target.checked){
          if(!courses.includes(e.target.label)){
              setCourses([...courses, e.target.label])
          }
      } else {
          setCourses(courses.filter(item => item != e.target.label))
          if(courses.length == 0){
              setCourseCheck(false)
          } else {
              setCourseCheck(true)
          }
      }
    };

    const [checkBoxes, setCheckBoxes] = useState<JSX.Element[]>(() => {
        return data?.map((course) => (
            <Checkbox key={course.id} checked={false} label={course.id} onChange={onChange}>
                {course.name}
            </Checkbox>
        )) || [];
    })


    useEffect(() => {
        setCheckBoxes(coursesInfo.current?.map((course) => (
            <Checkbox key={course.id} checked={course.checked} label={course.id} onChange={onChange}>
                {course.name}
            </Checkbox>
        )));
    }, [coursesInfo.current]);

  return (
    <>
        {checkBoxes}
      {/*<Checkbox.Group*/}
      {/*  options={data?.map((course) => ({*/}
      {/*    label: course.name,*/}
      {/*    value: course.id,*/}
      {/*  }))}*/}
      {/*  onChange={onChange}*/}
      {/*/>*/}

      <button onClick={() => console.log(courses)}>Click</button>
    </>
  )
}

export default Courses

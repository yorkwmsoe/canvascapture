import { useCallback } from 'react'
import { Checkbox, GetProp } from 'antd'
import { useGenerationStore } from '../../stores/generation.store'
import { useGetCourses } from '../../apis/canvas.api'

function Courses() {
  const { courses, setCourses } = useGenerationStore()
  //console.log(useGetCourses(), "y")
  const { data } = useGetCourses()

  // useEffect(() => {
  //     const fetchCourses = async () => {
  //         const loadedCourses = await useGetCourses().data?.map(item => item.name) || []
  //         setCourses(loadedCourses)
  //     }
  //     fetchCourses()
  // }, [setCourses])

  const onChange: GetProp<typeof Checkbox.Group<number>, 'onChange'> = useCallback(
    (checkedValues) => {
      setCourses(checkedValues)
    },
    [setCourses]
  )

  //console.log(useGetCourses().data)

  // <Checkbox.Group options={selected.map(item => item.title)} onChange={onChange}/>
  return (
    <>
      <Checkbox.Group
        options={data?.map((course) => ({
          label: course.name,
          value: course.id
        }))}
        onChange={onChange}
      />
      <button onClick={() => console.log(courses)}>Click</button>
    </>
  )
}

export default Courses

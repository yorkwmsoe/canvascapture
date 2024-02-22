import { Checkbox } from 'antd'
import { useMemo } from 'react'
import { useCourses } from '@renderer/hooks/useCourses'

export function Courses() {
    const { courses, selectedCourses, setSelectedCourses } = useCourses()

    const options = useMemo(() => {
        return courses?.map((course) => ({
            label: course.name,
            value: course.id,
        }))
    }, [courses])

    return (
        <Checkbox.Group
            options={options}
            defaultValue={selectedCourses}
            onChange={setSelectedCourses}
        />
    )
}

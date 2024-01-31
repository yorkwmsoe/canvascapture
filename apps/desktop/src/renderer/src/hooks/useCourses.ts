import { useGetCourses } from '@renderer/apis/canvas.api'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { useCallback } from 'react'

export const useCourses = () => {
  const { courses: selectedCourses, setCourses: setSelectedCourses } = useGenerationStore()
  const { data: courses } = useGetCourses()

  const getCourseById = useCallback(
    (id: number) => {
      return courses?.find((course) => course.id === id)
    },
    [courses]
  )

  return {
    selectedCourses,
    courses,
    getCourseById,
    setSelectedCourses
  }
}

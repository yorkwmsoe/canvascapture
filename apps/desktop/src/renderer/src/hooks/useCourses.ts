import { useGetCourses } from '@renderer/apis/canvas.api'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

export const useCourses = () => {
  const queryClient = useQueryClient()
  const { courses: selectedCourses, setCourses } = useGenerationStore()
  const { data: courses } = useGetCourses()

  const getCourseById = useCallback(
    (id: number) => {
      return courses?.find((course) => course.id === id)
    },
    [courses]
  )

  const setSelectedCourses = useCallback(
    (courses: number[]) => {
      selectedCourses.forEach((courseId) => {
        if (courses.includes(courseId)) return
        queryClient.invalidateQueries({
          queryKey: ['assignments', courseId]
        })
      })
      setCourses(courses)
    },
    [selectedCourses, setCourses]
  )

  return {
    selectedCourses,
    courses,
    getCourseById,
    setSelectedCourses
  }
}

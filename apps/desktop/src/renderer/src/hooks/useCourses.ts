/**
 * Defines the useCourses react hook
 *
 * See the definition below for more details
 */
import { useGetCourses } from '@renderer/apis/canvas.api'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { useCallback, useEffect } from 'react'

export const useCourses = () => {
    const { message } = App.useApp()
    const queryClient = useQueryClient()
    const { courses: selectedCourses, setCourses } = useGenerationStore()
    const { data: courses, isError } = useGetCourses()

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
                    queryKey: ['assignments', courseId],
                })
            })
            setCourses(courses)
        },
        [selectedCourses, setCourses]
    )

    useEffect(() => {
        if (isError) {
            message.destroy()
            message.error(
                'Failed to fetch courses. Your Canvas access token may be expired.'
            )
        }
    }, [isError, setCourses])

    return {
        selectedCourses,
        courses,
        getCourseById,
        setSelectedCourses,
    }
}

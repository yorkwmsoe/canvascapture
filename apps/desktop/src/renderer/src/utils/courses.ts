/**
 * Defines the getCourseName method
 *
 * See the definition below for more details
 */
import { Course } from '@canvas-capture/lib'

export function getCourseName(course?: Course) {
    return course?.original_name ?? course?.name ?? 'Unknown Course'
}

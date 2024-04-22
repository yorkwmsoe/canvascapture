import { Course } from '@canvas-capture/lib'
import { useAssignments } from '@renderer/hooks/useAssignments'
import { useCourses } from '@renderer/hooks/useCourses'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { useSettingsStore } from '@renderer/stores/settings.store'
import { parseHierarchyId } from '@renderer/utils/assignments'
import { getDocumentsPath } from '@renderer/utils/config'
import { ipcRenderer } from 'electron'
import { generate } from './generate'

export const useGenerate = () => {
    const { selectedAssignments, getAssignmentById } = useAssignments()
    const { courses, selectedCourses } = useCourses()
    const { canvasDomain, canvasAccessToken, isStudent } = useSettingsStore()
    const { generationName } = useGenerationStore()
    const documentsPath = getDocumentsPath()

    const selectedAssignmentsSplit = selectedAssignments.map((x) =>
        parseHierarchyId(x)
    )

    const filteredAssignments = selectedAssignmentsSplit.flatMap(
        ({ courseId, assignmentId }) =>
            getAssignmentById(courseId, assignmentId) ?? []
    )

    /* Cannot be undefined, as the UI prevents it */
    const filteredCourses = courses?.filter((x) =>
        selectedCourses.includes(x.id)
    ) as Course[]

    const runGenerate = async () => {
        ipcRenderer.send(
            'generate',
            await generate(
                filteredCourses,
                filteredAssignments,
                canvasAccessToken,
                canvasDomain,
                isStudent,
                generationName,
                documentsPath
            )
        )
    }

    return {
        runGenerate,
    }
}

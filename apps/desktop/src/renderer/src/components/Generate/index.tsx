import { Flex, Spin } from 'antd'
import { useAssignments } from '@renderer/hooks/useAssignments'
import { useCourses } from '@renderer/hooks/useCourses'
import { generate } from './generate'
import { parseHierarchyId } from '@renderer/utils/assignments'
import { useEffect } from 'react'
import { useSettingsStore } from '@renderer/stores/settings.store'
import { Course } from '@renderer/types/canvas_api/course'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { useNavigate } from '@tanstack/react-router'
import { ipcRenderer } from 'electron'
import { getDocumentsPath } from '@renderer/utils/config'

export function Generate() {
    const navigate = useNavigate({ from: '/generation' })
    const { selectedAssignments, getAssignmentById } = useAssignments()
    const { courses, selectedCourses } = useCourses()
    const { canvasDomain, canvasAccessToken } = useSettingsStore()
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
                generationName,
                documentsPath
            )
        )
        navigate({ to: '/' })
    }

    useEffect(() => {
        runGenerate()
    }, [])

    return (
        <Flex
            justify="center"
            align="center"
            style={{ height: '100%', flexDirection: 'column' }}
        >
            <Spin />
            <br />
            Generating
        </Flex>
    )
}

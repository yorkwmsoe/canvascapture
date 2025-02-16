/**
 * Defines the Generate react component which shows a loading screen,
 * while performing the generation behind the scenes
 *
 * See the definition below for more details
 */
import { Flex, Spin, Typography } from 'antd'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Course } from '@canvas-capture/lib'
import { useAssignments } from '@renderer/hooks/useAssignments'
import { useCourses } from '@renderer/hooks/useCourses'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { useSettingsStore } from '@renderer/stores/settings.store'
import { parseHierarchyId } from '@renderer/utils/assignments'
import { getDocumentsPath } from '@renderer/utils/config'
import { ipcRenderer } from 'electron'
import { generate } from '@renderer/components/Generate/generate'

export function Generate() {
    const navigate = useNavigate({ from: '/generation' })
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
        ipcRenderer.invoke(
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
        navigate({ to: '/' })
    }

    useEffect(() => {
        const run = async () => {
            await runGenerate()
            navigate({ to: '/' })
        }
        run()
    }, [])

    return (
        <Flex
            justify="center"
            align="center"
            style={{ height: '100%', flexDirection: 'column' }}
        >
            <Spin />
            <Typography.Text>Generating</Typography.Text>
        </Flex>
    )
}

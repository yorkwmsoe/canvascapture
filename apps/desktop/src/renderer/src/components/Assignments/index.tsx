import { useAssignments } from '@renderer/hooks/useAssignments'
import { useCourses } from '@renderer/hooks/useCourses'
import { generateHierarchyId } from '@renderer/utils/assignments'
import { isKeyArray } from '@renderer/utils/guards'
import { Select, Tree, TreeDataNode, TreeProps } from 'antd'
import { isString } from 'lodash'
import { useMemo, useState } from 'react'
import { SubmissionType } from '@canvas-capture/lib'

const options: {
    label: string
    value: SubmissionType
}[] = [
    { label: 'text entry', value: 'online_text_entry' },
    { label: 'url', value: 'online_url' },
    { label: 'file upload', value: 'online_upload' },
    { label: 'quiz', value: 'online_quiz' },
    { label: 'video recording', value: 'media_recording' },
    { label: 'student annotation', value: 'student_annotation' },
]

export function Assignments() {
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
    const {
        selectedAssignments,
        assignments,
        setSelectedAssignments,
        getSubmissionTypesForAssignment,
    } = useAssignments()
    const { getCourseById } = useCourses()
    const [selectedSubmissionTypes, setSelectedSubmissionTypes] = useState<
        SubmissionType[]
    >([])

    const treeData = useMemo(() => {
        return assignments.map<TreeDataNode>((assignment) => {
            const course = getCourseById(assignment.courseId)
            const filteredAssignments = assignment.assignments.filter(
                (submission) => {
                    const submissionTypesForAssignment =
                        getSubmissionTypesForAssignment(
                            assignment.courseId,
                            submission.id
                        )
                    if (!selectedSubmissionTypes.length) return true
                    return selectedSubmissionTypes.some((type) =>
                        submissionTypesForAssignment.includes(type)
                    )
                }
            )
            return {
                title: course?.original_name ?? course?.name,
                key: assignment.courseId,
                selectable: false,
                disableCheckbox: !filteredAssignments.length,
                children: filteredAssignments.map<TreeDataNode>(
                    (individualAssignment) => {
                        return {
                            title: individualAssignment.name,
                            key: generateHierarchyId(
                                assignment.courseId,
                                individualAssignment.id
                            ),
                            selectable: false,
                        }
                    }
                ),
            }
        })
    }, [
        assignments,
        getCourseById,
        getSubmissionTypesForAssignment,
        selectedSubmissionTypes,
    ])

    const onExpand = (expandedKeysValue: React.Key[]) => {
        setExpandedKeys(expandedKeysValue)
    }

    const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
        if (!isKeyArray(checkedKeysValue)) return
        setSelectedAssignments(checkedKeysValue.filter(isString))
    }

    const filterAssignments = (selectedOptions: SubmissionType[]) => {
        setSelectedSubmissionTypes(selectedOptions)
    }

    return (
        <div>
            <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="FILTER"
                onChange={filterAssignments}
                options={options}
            />
            <Tree
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                onCheck={onCheck}
                checkedKeys={selectedAssignments}
                treeData={treeData}
            />
        </div>
    )
}

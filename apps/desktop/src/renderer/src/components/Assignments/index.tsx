import { useAssignments } from '@renderer/hooks/useAssignments'
import { useCourses } from '@renderer/hooks/useCourses'
import { generateHierarchyId } from '@renderer/utils/assignments'
import { isKeyArray } from '@renderer/utils/guards'
import { Select, SelectProps, Tree, TreeDataNode, TreeProps } from 'antd'
import { isString } from 'lodash'
import { useMemo, useState } from 'react'
import { SubmissionType } from '../../types/canvas_api/submission'

export function Assignments() {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const {
    selectedAssignments,
    assignments,
    setSelectedAssignments,
    getSubmissionTypesForAssignment
  } = useAssignments()
  const { getCourseById } = useCourses()
  const [selectedSubmissionTypes, setSelectedSubmissionTypes] = useState<SubmissionType[]>([])

  const treeData = useMemo(() => {
    return assignments.map<TreeDataNode>((assignment) => {
      const course = getCourseById(assignment.courseId)
      const filteredAssignments = assignment.assignments.filter((submission) => {
        const submissionTypesForAssignment = getSubmissionTypesForAssignment(
          assignment.courseId,
          submission.id
        )
        if (!selectedSubmissionTypes.length) return true
        return selectedSubmissionTypes.some((type) => submissionTypesForAssignment.includes(type))
      })
      return {
        title: course?.name,
        key: assignment.courseId,
        selectable: false,
        disableCheckbox: !filteredAssignments.length,
        children: filteredAssignments.map<TreeDataNode>((submission) => {
          return {
            title: submission.name,
            key: generateHierarchyId(assignment.courseId, submission.id),
            selectable: false
          }
        })
      }
    })
  }, [assignments, getCourseById, getSubmissionTypesForAssignment, selectedSubmissionTypes])

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

  const submissionTypes: SubmissionType[] = [
    'online_text_entry',
    'online_url',
    'online_upload',
    'online_quiz',
    'media_recording',
    'student_annotation'
  ]

  const SubmissionTypeLabel = [
    'text entry',
    'url',
    'file upload',
    'quiz',
    'video recording',
    'student annotation'
  ]

  const options: SelectProps['options'] = []
  let i = 0
  for (const type of submissionTypes) {
    options.push({
      value: type,
      label: SubmissionTypeLabel[i]
    })
    i++
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

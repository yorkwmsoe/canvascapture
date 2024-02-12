import { useAssignments } from '@renderer/hooks/useAssignments'
import { useCourses } from '@renderer/hooks/useCourses'
import { generateHierarchyId } from '@renderer/utils/assignments'
import { isKeyArray } from '@renderer/utils/guards'
import { Tree, TreeDataNode, TreeProps } from 'antd'
import { isString } from 'lodash'
import { useMemo, useState } from 'react'

export function Assignments() {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const { selectedAssignments, assignments, setSelectedAssignments } = useAssignments()
  const { getCourseById } = useCourses()

  const treeData = useMemo(() => {
    return assignments.map<TreeDataNode>((assignment) => {
      const course = getCourseById(assignment.courseId)
      return {
        title: course?.name,
        key: assignment.courseId,
        selectable: false,
        disableCheckbox: !assignment?.assignments.length,
        children: assignment?.assignments.map<TreeDataNode>((individualAssignment) => {
          return {
            title: individualAssignment.name,
            key: generateHierarchyId(assignment.courseId, individualAssignment.id),
            selectable: false
          }
        })
      }
    })
  }, [assignments, getCourseById])

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue)
  }

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    if (!isKeyArray(checkedKeysValue)) return
    setSelectedAssignments(checkedKeysValue.filter(isString))
  }

  return (
    <div>
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

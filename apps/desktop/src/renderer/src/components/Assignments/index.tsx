import { useAssignments } from '@renderer/hooks/useAssignments'
import { useCourses } from '@renderer/hooks/useCourses'
import { generateHierarchyId } from '@renderer/utils/assignments'
import { isKeyArray } from '@renderer/utils/guards'
import { Tree, TreeDataNode, TreeProps } from 'antd'
import { isString } from 'lodash'
import { useMemo, useState } from 'react'

export function Assignments() {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const { selectedAssignments, assignments, setSelectedAssignments, getAssignmentsByCourseId } =
    useAssignments()
  const { selectedCourses, getCourseById } = useCourses()

  const treeData = useMemo(() => {
    return selectedCourses.map<TreeDataNode>((courseId, idx) => {
      const courseAssignments = getAssignmentsByCourseId(courseId)
      const course = getCourseById(courseId)
      return {
        title: course?.name,
        key: course?.id ?? idx,
        selectable: false,
        disableCheckbox: !courseAssignments?.length,
        children: courseAssignments?.map<TreeDataNode>((submission) => {
          return {
            title: submission.name,
            key: generateHierarchyId(courseId, submission.id),
            selectable: false
          }
        })
      }
    })
  }, [selectedCourses, assignments, getCourseById])

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

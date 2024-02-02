import { useGetAssignments } from '@renderer/apis/canvas.api'
import { useCourses } from '@renderer/hooks/useCourses'
import { useGenerationStore } from '@renderer/stores/generation.store'
import { generateHierarchyId } from '@renderer/utils/assignments'
import { isKeyArray } from '@renderer/utils/guards'
import { Tree, TreeDataNode, TreeProps } from 'antd'
import { isString } from 'lodash'
import { useMemo, useState } from 'react'

export function Assignments() {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const { getCourseById } = useCourses()
  const { data } = useGetAssignments()
  const { setAssignments } = useGenerationStore()

  const treeData = useMemo(() => {
    return data?.map<TreeDataNode>((assignment) => {
      const course = getCourseById(assignment.courseId)
      return {
        title: course?.name,
        key: assignment.courseId,
        selectable: false,
        disableCheckbox: !assignment.assignments?.length,
        children: assignment.assignments?.map<TreeDataNode>((submission) => {
          return {
            title: submission.name,
            key: generateHierarchyId(assignment.courseId, submission.id),
            selectable: false
          }
        })
      }
    })
  }, [data])

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue)
  }

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    if (!isKeyArray(checkedKeysValue)) return
    setAssignments(checkedKeysValue.filter(isString))
    setCheckedKeys(checkedKeysValue)
  }

  return (
    <div>
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        treeData={treeData}
      />
    </div>
  )
}

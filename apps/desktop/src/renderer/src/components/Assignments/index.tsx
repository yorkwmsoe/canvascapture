import { useGetAssignments } from '@renderer/apis/canvas.api'
import { useCourses } from '@renderer/hooks/useCourses'
import { Tree, TreeDataNode, TreeProps } from 'antd'
import { useMemo, useState } from 'react'

function isKeyArray(value: unknown): value is React.Key[] {
  return Array.isArray(value)
}

export function Assignments() {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const { getCourseById } = useCourses()
  const { data } = useGetAssignments()

  console.log(checkedKeys)

  const treeData = useMemo(() => {
    return data?.map<TreeDataNode>((assignment) => {
      const course = getCourseById(assignment.courseId)
      return {
        title: course?.name,
        key: assignment.courseId,
        selectable: false,
        children: assignment.assignments?.map<TreeDataNode>((submission) => {
          return {
            title: submission.name,
            key: `${assignment.courseId}-${submission.id}`,
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

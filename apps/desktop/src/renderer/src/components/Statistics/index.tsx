/**
 * Defines the Statistics react component
 * and additional methods to get the values of its checkboxes
 *
 * See the individual definitions below for more details
 */
import { Checkbox } from 'antd'
import { useEffect, useState } from 'react'
import { useGenerationStore } from '@renderer/stores/generation.store'

/**
 * A Map that associates checkbox item names with their corresponding titles.
 */
const titleByItemName = new Map<string, string>()
titleByItemName.set('averageGradeByGroup', 'Average Grade by Group')
titleByItemName.set('averageGradeByAssignment', 'Average Grade by Assignment')
titleByItemName.set('gradingTurnaroundByGroup', 'Grading Turnaround by Group')
titleByItemName.set(
    'gradingTurnaroundByAssignment',
    'Grading Turnaround by Assignment'
)

export function Statistics() {
    const { requestedCharts, setRequestedChart } = useGenerationStore()

    // State to track which checkboxes are checked.
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
        // Average Grade Charts
        averageGradeByGroup: requestedCharts.averageGradeByGroup ?? false,
        averageGradeByAssignment:
            requestedCharts.averageGradeByAssignment ?? false,

        // Turnaround charts
        gradingTurnaroundByGroup:
            requestedCharts.gradingTurnaroundByGroup ?? false,
        gradingTurnaroundByAssignment:
            requestedCharts.gradingTurnaroundByAssignment ?? false,
    })

    // Handler to toggle the checkbox state.
    const handleCheckboxChange = (itemName: string, checked: boolean) => {
        setCheckedItems({ ...checkedItems, [itemName]: checked })
    }

    // Ensure stores has set values.
    useEffect(() => {
        Object.entries(checkedItems).forEach(([key, value]) => {
            setRequestedChart(key, value)
        })
    }, [checkedItems, setRequestedChart])

    return (
        <>
            {Object.keys(checkedItems).map((itemName) => (
                <Checkbox
                    key={itemName}
                    checked={checkedItems[itemName]}
                    onChange={(e) =>
                        handleCheckboxChange(itemName, e.target.checked)
                    }
                >
                    {titleByItemName.get(itemName) ?? itemName}
                </Checkbox>
            ))}
        </>
    )
}

import { Checkbox } from 'antd'
import React, { useState } from 'react'

let oneYearStat = false
let avgAssignGrade = false

export function Statistics() {
    const [oneYearChecked, setOneYearChecked] = useState(oneYearStat)
    const [avgAssignChecked, setAvgAssignChecked] = useState(avgAssignGrade)


    const OneYearChange = () => {
        const newState = !oneYearChecked
        setOneYearChecked(newState)
        oneYearStat = newState
    }

    const avgAssignChange = () => {
        const newState = !avgAssignChecked
        setAvgAssignChecked(newState)
        avgAssignGrade = newState
    }

    return (
        <>
            <Checkbox
                title="Time to grade assignments, over one year"
                checked={oneYearChecked} //when set[insertVariableName] is called, it updates the checkbox UI
                onChange={OneYearChange}
            >
                Time to Grade
            </Checkbox>
            <Checkbox
                title="Time to grade assignments, over multiple years"
                checked={avgAssignChecked} //when set[insertVariableName] is called, it updates the checkbox UI
                onChange={avgAssignChange}
            >
                Average Assignment Grades
            </Checkbox>
        </>
    )
}

export function oneYearExport() {
    return oneYearStat
}

export function AverageAssignmentGradeExport() {
    return avgAssignGrade
}

//This is way too much code for what should be built in. What a huge waste of time from this terrible api
//Why would I use a checkbox, if not for changing a variable
//The api should just have the "value=variable" and then update that variable when the checkbox is checked

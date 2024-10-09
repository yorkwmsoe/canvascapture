import { Checkbox } from 'antd'
import React, { useState } from 'react'

let oneYearStat = false
let allYearStat = false
let avgCourseGrade = false

export function Statistics() {
    const [oneYearChecked, setOneYearChecked] = useState(oneYearStat)
    const [allYearChecked, setAllYearChecked] = useState(allYearStat)
    const [avgCourseChecked, setAvgCourseChecked] = useState(avgCourseGrade)

    const avgCourseChange = () => {
        const newState = !avgCourseChecked
        setAvgCourseChecked(newState)
        avgCourseGrade = newState
        console.log('Average Course Grades Clicked: ', newState)
    }

    const OneYearChange = () => {
        const newState = !oneYearChecked
        setOneYearChecked(newState)
        oneYearStat = newState
        console.log('One Year Stat Clicked: ', newState)
    }

    return (
        <>
            <Checkbox
                title="Time to grade assignments, over one year"
                checked={oneYearChecked} //when set[insertVariableName] is called, it updates the checkbox UI
                onChange={OneYearChange}
            >
                TTG One Year
            </Checkbox>
            <Checkbox
                title="Time to grade assignments, over multiple years"
                checked={allYearChecked} //when set[insertVariableName] is called, it updates the checkbox UI
                onChange={() => {
                    const newState = !allYearChecked
                    setAllYearChecked(newState)
                    console.log('All Years Clicked: ', newState)
                }}
            >
                TTG All Years
            </Checkbox>
            <Checkbox
                title="Average course grades"
                checked={avgCourseChecked} //when set[insertVariableName] is called, it updates the checkbox UI
                onChange={avgCourseChange}
            >
                Average Course Grades
            </Checkbox>
        </>
    )
}

export function oneYearExport() {
    console.log('One Year Stat: ', oneYearStat)
    return oneYearStat
}

export function allYearExport() {
    return allYearStat
}

export function avgCourseGradeExport() {
    console.log('AvgCourseGrade: ', avgCourseGrade)
    return avgCourseGrade
}
//This is way too much code for what should be built in. What a huge waste of time from this terrible api
//Why would I use a checkbox, if not for changing a variable
//The api should just have the "value=variable" and then update that variable when the checkbox is checked

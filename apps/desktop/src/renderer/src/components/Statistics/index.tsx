import { Checkbox } from 'antd'

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const statisticsIndexVariable = '12'

let oneYearStat = false
let allYearStat = false

export function Statistics() {
    return (
        <>
            <Checkbox
                title="Time to grade assignments, over one year"
                value={oneYearStat}
            >
                TTG One Year
            </Checkbox>
            <Checkbox
                title="Time to grade assignments, over multiple years"
                value={allYearStat}
            >
                TTG All Years
            </Checkbox>
            <Checkbox>Average Course Grades</Checkbox>
        </>
    )
}

export function oneYearExport() {
    return oneYearStat
}

export function allYearExport() {
    return allYearStat
}

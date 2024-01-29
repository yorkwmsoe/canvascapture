import React, {useState} from "react";
import {box} from "../../components/SwitchStepper";
import {Checkbox, GetProp} from "antd";
import {Simulate} from "react-dom/test-utils";
import select = Simulate.select;
import {useGenerationStore} from "../../stores/generation.store";

function Courses() {
    const {courses, setCourses} = useGenerationStore()

    // const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    //     //console.log('checked = ', checkedValues);
    //
    //     //if (stage === 'Courses') {
    //     selected.forEach(item => {
    //         if (checkedValues.includes(item.title)) {
    //             item.isChecked = true;
    //         } else {
    //             item.isChecked = false;
    //         }
    //     })
    //     //}
    // };



    return (
        <Checkbox.Group options={selected.map(item => item.title)} onChange={onChange}/>
    )

} export default Courses;

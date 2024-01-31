import React, {useEffect, useState} from "react";
import {box} from "../../components/SwitchStepper";
import {Checkbox, GetProp} from "antd";
import {Simulate} from "react-dom/test-utils";
import select = Simulate.select;
import {useGenerationStore} from "../../stores/generation.store";
import {useGetCourses} from "../../apis/canvas.api";

function Courses() {
    const {courses, setCourses} = useGenerationStore()
    //console.log(useGetCourses(), "y")
    const allCourses = useGetCourses().data?.map(item => item.name)


    // useEffect(() => {
    //     const fetchCourses = async () => {
    //         const loadedCourses = await useGetCourses().data?.map(item => item.name) || []
    //         setCourses(loadedCourses)
    //     }
    //     fetchCourses()
    // }, [setCourses])

    const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
        //console.log('checked = ', checkedValues);
        // checkedValues.forEach(item => {
        //     if (courses.includes(item.toString())) {
        //         console.log("isrun")
        //         setCourses(courses.filter(c => c != item))
        //     } else {
        //         setCourses([...courses,item.toString()])
        //         console.log([...courses,item.toString()])
        //     }
        // })
        // if (checkedValues.length == 0){
        //     console.log("yup")
        //     setCourses([])
        // }

        allCourses?.forEach((outerCourse) => {
            let isChecked = false
            checkedValues.forEach((innerCourse) => {
                if(innerCourse == outerCourse){
                    isChecked = true
                }
            })
            if(isChecked && !courses.includes(outerCourse)) {
                setCourses([...courses, outerCourse])
            } else if(!isChecked){
                setCourses(courses.filter(c => c != outerCourse))
            }
        })
    };




    //console.log(useGetCourses().data)


// <Checkbox.Group options={selected.map(item => item.title)} onChange={onChange}/>
    return (
        <>
        <Checkbox.Group options={allCourses} onChange={onChange}/>
        <button onClick={() => console.log(courses)}>Click</button>
        </>
    )

}

export default Courses;

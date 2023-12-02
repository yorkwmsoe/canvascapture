<script lang="ts">
    import {Stepper, Step} from "@skeletonlabs/skeleton";
    import {getConfigState} from "$lib/config";
    import {getCourses, getAssignments, getSubmissions} from "$lib/api";
    //import type {Course} from "$lib/types/course"

    //Declaring types, these can probably just go in a different file and be imported
    type CourseSlot = {
        name: string | undefined,
        id: number,
        checkedStatus: boolean
    }
    type AssignSlot = {
        name: string | undefined,
        id: number,
        courseid: number,
        checkedStatus: boolean
    }
    type SubmissionSlot = {
        id: number,
        grade: number,
        score: number,
        comments: string | undefined
    }

    //Will change just getting to work for now getConfigState().canvasDomain
    const canvasDomain = "http://sdlstudentvm06.msoe.edu" + "/api/v1";
    const canvasAPIToken = "reK0qt1RHGt1tCVrNwrNasbWnOd8T52y2vW4BV3yM1mXZ9jtLAXU6Xn2mtzcNZ3B"

    //defining arrays to hold the retrieved Canvas data
    let courses: CourseSlot[] = []
    let assignments: AssignSlot[] = []
    let submissions: SubmissionSlot[] = []

    //loading variables that will be used in the html section. If that data has not been loaded
    //no data will appear in HTML. Once the data is loaded though, the data will appear and be rendered
    let isCourseLoading = true
    let isAssignmentsLoading = true;

    /**
     * loadCourses
     * This method first grabs the courses from the given canvasDomain and given token.
     * It then stores the data in the global courses variable.
     */
    const loadCourses = () => {
        //API call to grab data
        let coursesData = getCourses(canvasDomain, canvasAPIToken)
        coursesData.then((d) => {
            //console.log(d)
            //take each return object and cast it as type CourseSlot. add to overall courses variable
            d.forEach((courseObj) => {
                let courseType: CourseSlot = {name: courseObj.name, id: courseObj.id,
                    checkedStatus: false} as CourseSlot;
                courses.push(courseType);
            })
            //change variable to false so that certain HTML elements will be rendered
            isCourseLoading = false
        });
    }

    //load the courses upon initial render
    loadCourses()

    /**
     * resetData
     * This method resets the courses, assignments, and submissions variables. The courses variable
     * has each checkedStatus variable be set to false since the courses do not need to be retrieved
     * from the API more than once. If the user decides to alter their settings, courses does not need
     * to be fully reset since the loadCourses always gets called on initial startup regardless of whether
     * or not the config changes. Assignments and submissions are fully reset because they depend on
     * the selected courses
     */
    const resetData = () => {
        courses.map(item => item.checkedStatus = false)
        assignments = [];
        submissions = [];
        isAssignmentsLoading = true;
    }

    /**
     * next
     * This method gets called when the next button is pressed
     * It loops over the selected courses and makes an API call to get all the assignmnets for each
     * course. Once the courses have been retrieved, the data will be rendered and displayed
     */
    const next = async () => {
        //grab all of the courses that have been selected and loop over them
        let selectedCourses: CourseSlot[] = checkSelections(courses) as CourseSlot[]
        selectedCourses.forEach((course) => {
            //get all the assignments associated with the given course
            let assignmentsData = getAssignments(canvasDomain, canvasAPIToken, course.id)
            assignmentsData.then((d) => {
                //loop over each object retrieved from the API call and cast them to type AssignSlot
                //then push them to the global assignments
                d.forEach((assignObj) => {
                    let assignType: AssignSlot = {
                        name: assignObj.name, id: assignObj.id, courseid: course.id,
                        checkedStatus: false
                    } as AssignSlot;
                    assignments.push(assignType);
                })

                //checks to see if within the last CourseSlot entry in selected courses so that it sets
                // the boolean to true which allows the results to be rendered properly
                if (course.id == selectedCourses[selectedCourses.length - 1].id) {
                    isAssignmentsLoading = false
                }

            });
        })
    }

    /**
     * comp
     * FURTHER IMPLEMENTATION NEEDED
     * This method gets ran when the 'Complete' button is pressed and it makes an API call to all of
     * the selected assignmenst (which have a courseid attribute) and makes and API call to grab the
     * submissions. So far nothing is done once those have been retrieved and further implementation
     * needs to be considered.
     */
    const comp = () => {
        //grab the selected assignments and loop over them
        let selected: AssignSlot[] = checkSelections(assignments) as AssignSlot[]
        selected.forEach((assign) => {
            //make API call to grab the submissions using the courseid and id associated with each assignment
            let submissionsData = getSubmissions(canvasDomain, canvasAPIToken, assign.courseid, assign.id)
            submissionsData.then((d) => {
                //loop over the retrieved data from the API call and cast each object to a SubmissionSlot
                //type and then push it to the global submissions variable
                d.forEach((subObj) => {
                    let subType: SubmissionSlot = {id: subObj.id, grade: subObj.grade, score: subObj.score
                    } as SubmissionSlot;
                    submissions.push(subType);
                })

                //logic to detect if the last AssignSlot within selected assignments so that the data
                // gets rendered properly
                if(assign.id == selected[selected.length-1].id){
                    //WORK NEEDS TO BE DONE HERE, SPECIFICALLY GENERATING THE ACTUAL MARKDOWN FILES
                    console.log(submissions)
                }

            });
        })


    }


    /**
     * back
     * gets called when the back button is pressed. calls reset data. This is a separate function
     * in case further implementation requires work to be done which is not relevant to resetting
     * the data
     */
    const back = () => {
        resetData()
    }

    /**
     * onCourseClick
     * FURTHER IMPLEMENTATION NEEDED
     * Whenever a course gets clicked (HTMLOption element) changed the checkedStatus the selected
     * value of the element. This method loops over all the global courses and checks to see if the
     * names match up which just links the two. This works if the courses all have unique names. If
     * there are multiple courses with the same name this could cause problems. The target solution is
     * to somehow associate the courseID with the option element. I believe I have tried to bind a
     * variable and even set the value and some things went awry. I can't completely remember. This
     * is most likely going to be development for spring term
     * @param event
     */
    const onCourseClick = (event) => {
        let element: HTMLOptionElement = event.target
        courses.forEach((course) => {
            if (course.name == element.text) {
                course.checkedStatus = element.selected;
            }
        })
    }

    /**
     * onAssignClick
     * FURTHER IMPLEMENTATION NEEDED
     * Whenever a assignment gets clicked (HTMLOption element) changed the checkedStatus the selected
     * value of the element. This method loops over all the global assignment and checks to see if the
     * names match up which just links the two. This works if the assignment all have unique names. If
     * there are multiple assignment with the same name this could cause problems. The target solution is
     * to somehow associate the assignmentID with the option element. I believe I have tried to bind a
     * variable and even set the value and some things went awry. I can't completely remember. This
     * is most likely going to be development for spring term
     * @param event
     */
    const onAssignClick = (event) => {
        let element: HTMLOptionElement = event.target
        assignments.forEach((assign) => {
            if (assign.name == element.text) {
                assign.checkedStatus = element.selected
            }
        })
    }

    /**
     * checkSelections
     * Loops through the given parameter which can either be of type CourseSlot or AssignSlot
     * and return the values which have a checkedStatus of true
     * @param allItems
     */
    const checkSelections = (allItems: CourseSlot [] | AssignSlot[]) => {
       let selected: CourseSlot [] | AssignSlot[] = allItems.filter(item => item.checkedStatus)
        return selected;
    }

</script>

<style>
    .select-content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

    }

    .select-page {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 20px;
        border: 1px solid #ccc; /* Optional: Add a border for better visibility */
    }

    h1 {
        margin-bottom: 5%;
    }

    .progress-fetch-bar {
        margin-bottom: 5%;
    }

    .select-button-bar {
        width: 100%;
        display: flex;
        justify-content: space-between;

    }

    .btn-gen {
        /*align-self: flex-end;*/
        margin-left: auto;
    }

    .btn-back {
        /*align-self: flex-start;*/
        margin-right: auto;
    }

    .main-content {
        width: 100%;
        height: 40vh;
    }

    .card {
        margin-bottom: 5%;
    }

    .select {
        margin: 0px;
    }

    .progress-div {
        margin-bottom: 5%;
    }

</style>

<div class="select-page">
    <div class="select-content">
        <h1 class="h1 gradient-heading">Select Items</h1>
        <Stepper stepTerm="Section" on:next={next} on:complete={comp} on:back={back}>

            <Step stepTerm="Courses">
                <svelte:fragment slot="header">Courses</svelte:fragment>
                <div class="card p-4 main-content variant-filled-surface bg-blue-200">
                    <p class="p">Hold 'ctrl' or 'shift' to make multiple selections</p>
                    <select class="select bg-black rounded" size="4" value="1" multiple>
                        {#if !isCourseLoading}
                        {#each courses as course}
                            <option class="text-surface-900" on:click={onCourseClick}>{course.name}</option>
                        {/each}
                        {/if}
                    </select>
                </div>
            </Step>

            <Step stepTerm="Assignments">
                <svelte:fragment slot="header">Assignments</svelte:fragment>
                <div class="card p-4 main-content variant-filled-surface bg-blue-200">
                    <p class="p">Hold 'ctrl' or 'shift' to make multiple selections</p>
                    <select class="select bg-black rounded" size="4" value="1" multiple>
                        {#if !isAssignmentsLoading}
                            {#each assignments as assign}
                                <option class="text-surface-900" on:click={onAssignClick}>{assign.name}</option>
                            {/each}
                        {/if}
                    </select>
                </div>
            </Step>
        </Stepper>

        <!--<div class="select-button-bar">
            <button type="button" class="btn btn-back bg-gradient-to-br variant-gradient-warning-error">Back</button>
            <button type="button" class="btn btn-gen variant-filled">Generate</button>
        </div>-->
    </div>
</div>



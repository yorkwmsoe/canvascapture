<script>


import {Stepper, Step} from "@skeletonlabs/skeleton";
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
        margin-bottom:5%;
    }

    .select {
        margin:0px;
    }

    .progress-div {
        margin-bottom: 5%;
    }

</style>
<div class="select-page">
    <div class="select-content">
        <h1 class="h1">Select Courses</h1>

        <Stepper stepTerm="Section">
            <Step stepTerm="Courses">
                <div class="card p-4 main-content variant-filled-surface bg-surface-500">
                    <p class="p">Hold 'ctrl' or 'shift' to make multiple selections</p>
                    <select class="select bg-surface-500 rounded" size="4" value="1" multiple>
                        <option class="text-surface-900" value="1">Option 1</option>
                        <option class="text-surface-900" value="2">Option 2</option>
                        <option class="text-surface-900" value="3">Option 3</option>
                        <option class="text-surface-900" value="4">Option 4</option>
                        <option class="text-surface-900" value="5">Option 5</option>
                    </select>
                </div>
            </Step>
            <Step stepTerm="Assignments">
                <div class="card p-4 main-content variant-filled-surface bg-surface-500">
                    <p class="p">Hold 'ctrl' or 'shift' to make multiple selections</p>
                    <select class="select bg-surface-500 rounded" size="4" value="1" multiple>
                        <option class="text-surface-900" value="1">Option 1</option>
                        <option class="text-surface-900" value="2">Option 2</option>
                        <option class="text-surface-900" value="3">Option 3</option>
                        <option class="text-surface-900" value="4">Option 4</option>
                        <option class="text-surface-900" value="5">Option 5</option>
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



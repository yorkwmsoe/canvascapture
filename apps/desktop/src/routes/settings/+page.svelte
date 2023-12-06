<script lang="ts">
	import { getConfigState, updateConfigState } from "$lib/config";
	import BackNav from "../../components/BackNav.svelte";
    import { getToastStore } from '@skeletonlabs/skeleton';

    const toastStore = getToastStore();

    const currentState = getConfigState();

    let canvasDomain = currentState.canvasDomain;
    let canvasApiToken = currentState.canvasApiToken;

    async function handleSubmit() {
        updateConfigState(
            {
                canvasDomain,
                canvasApiToken
            }
        ).then(() => {
            toastStore.trigger({
                message: "Settings saved!"
            })
        });
    }
</script>


<BackNav page="/home" />

<div class="h-full grid place-items-center">
    <div>
     <h1 class="h1 mb-8 text-center">Settings</h1>
     <form class="flex gap-4 flex-col" on:submit|preventDefault={handleSubmit}>
         <label class="label">
             <span>Domain</span>
             <input bind:value={canvasDomain} class="input" type="url" placeholder="msoe.instructure.com"/>
         </label>
         <label class="label">
             <span>Access Key</span>
             <input bind:value={canvasApiToken} class="input" type="text" placeholder="Access Key" required/>
         </label>
         <button type="submit" class="btn variant-filled-secondary">Save</button>
     </form>
    </div>
 </div>
 

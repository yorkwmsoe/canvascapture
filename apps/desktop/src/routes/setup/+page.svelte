<script lang="ts">
	import { updateConfigState } from "$lib/config";
	import { TITLE_TEXT } from "$lib/constants";

    let canvasDomain: string;
    let canvasApiToken: string;

    async function handleSubmit() {
        updateConfigState(
            {
                canvasDomain,
                canvasApiToken
            }
        ).then(() => {
            window.location.replace('/settings')
        });
    }
</script>

<div class="h-full grid place-items-center">
   <div>
    <h1 class="h1 mb-8 text-center">Welcome to <br/> <span class="gradient-heading">{TITLE_TEXT}</span></h1>
    <form class="flex gap-4 flex-col" on:submit|preventDefault={handleSubmit}>
        <label class="label">
            <span>Domain</span>
            <input bind:value={canvasDomain} class="input" type="url" placeholder="msoe.instructure.com"/>
        </label>
        <label class="label">
            <span>Access Key</span>
            <input bind:value={canvasApiToken} class="input" type="text" placeholder="Access Key" required/>
        </label>
        <button type="submit" class="btn variant-filled-secondary">Continue</button>
    </form>
   </div>
</div>

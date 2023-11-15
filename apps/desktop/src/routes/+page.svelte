<script>
    import { ProgressRadial } from "@skeletonlabs/skeleton"
	import { getConfigState, isConfigSetup, loadConfigState } from "$lib/config";

    let isLoading = true;
    loadConfigState().then(async () => {
        isLoading = false;
        if (!isConfigSetup()) {
            window.location.replace('/setup');
        }
        console.log(getConfigState());
    });
</script>


{#if isLoading} 
<div class="h-full grid place-items-center">
    <ProgressRadial value={undefined}  meter="stroke-primary-500" track="stroke-primary-500/30" />
</div>
{/if}

{#if !isLoading} 
<div>Home Page</div>
{/if}
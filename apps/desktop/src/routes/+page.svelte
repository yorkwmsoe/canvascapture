<script>
	import { isConfigSetup, loadConfigState } from "$lib/config";

    let isLoading = true;
    loadConfigState().then(async () => {
        isLoading = false;
        if (!isConfigSetup()) {
            window.location.replace('/setup');
        }
    });
</script>
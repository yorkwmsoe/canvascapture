<script>
	import { isConfigSetup, loadConfigState } from "$lib/config";

    const runAsync = (async () => {
        await loadConfigState()
        if (!isConfigSetup()) {
            window.location.replace('/setup');
        } else {
            window.location.replace('/home');
        }
    });
    runAsync();
</script>
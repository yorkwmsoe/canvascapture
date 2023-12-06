<script>
	import { loadConfigState } from "$lib/config";
	import { Toast, initializeStores } from '@skeletonlabs/skeleton';
	import '../app.postcss';
	import "@fortawesome/fontawesome-free/css/all.css"; 
	
	initializeStores();
	loadConfigState();
</script>

<div class="h-full">
	<slot/>
	<Toast position="t" />
</div>


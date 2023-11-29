<script>
	import '../app.postcss';

	import { Toast, initializeStores } from '@skeletonlabs/skeleton';
	initializeStores();
</script>

<div class="h-full">
	<slot/>
	<Toast position="t" />
</div>


<script>
	import '../app.postcss';
	import "@fortawesome/fontawesome-free/css/all.css"; 

	import { AppBar, Toast } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';

	initializeStores();
</script>

<style>
</style>

<div class="h-full">
	<Toast />
	<AppBar>
		<svelte:fragment slot="lead">
			<a href="/home">
				<i class="fa-solid fa-home text-2xl" />
			</a>
		</svelte:fragment>
			<span class="gradient-heading">
				Canvas Capture
			</span>
		<svelte:fragment slot="trail">
			<a href="/settings">
				<i class="fa-solid fa-gear text-xl" />
			</a>
		</svelte:fragment>
	</AppBar>
	<slot/>
</div>


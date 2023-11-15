<script>
	import '../app.postcss';
	import { AppBar } from '@skeletonlabs/skeleton';
	import "@fortawesome/fontawesome-free/css/all.css"; 
</script>

<style>
</style>

<div class="h-full">
	<AppBar>
		<svelte:fragment slot="lead">
			<a href="/home">
				<i class="fa-solid fa-home text-2xl" />
			</a>
		</svelte:fragment>
			<span class="bg-gradient-to-br from-red-500 to-black bg-clip-text text-transparent">
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


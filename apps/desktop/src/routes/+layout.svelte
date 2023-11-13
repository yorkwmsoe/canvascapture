<script>
	import '../app.postcss';
</script>
<style>
	h5 {
		display: inline;
		margin-right: 20px; /* Adjust the margin as needed */
	}
	#sdl-name{
		margin-right: 80%;
	}
</style>

<div class="h-full">
	<nav>
		<h5 class="h5" id="sdl-name">Canvas Capture</h5>
		<!--need to include little icon-->
		<a href="/settings">
			<h5 class="h5">Settings</h5>
		</a>
	</nav>
	<slot/>
</div>


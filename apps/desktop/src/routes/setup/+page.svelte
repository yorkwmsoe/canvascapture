<script>
    function handleSubmit() {
        window.location.replace("/")
    }
</script>

<div class="h-full grid place-items-center">
   <div>
    <h1 class="h1 mb-8 text-center">Welcome to <br/> <span class="gradient-heading">Canvas Capture</span></h1>
    <form class="flex gap-4 flex-col" on:submit|preventDefault={handleSubmit}>
        <label class="label">
            <span>Domain</span>
            <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
                <div class="input-group-shim">https://</div>
                <input type="url" placeholder="msoe.instructure.com"/>
              </div>
        </label>
        <label class="label">
            <span>Access Key</span>
            <input class="input" title="Access Key" type="text" placeholder="Access Key" required/>
        </label>
        <button type="submit" class="btn variant-filled-secondary">Continue</button>
    </form>
   </div>
</div>

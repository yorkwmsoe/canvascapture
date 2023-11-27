<script>
    import { version } from '$app/environment';
</script>
<style>

</style>

<div class="h-full grid place-items-center">
    <form method="GET" class="flex gap-4 flex-col" action="/select">
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <input type="text" name="generationName" placeholder="Generation Name" required/>
            <button class="variant-filled-secondary">
                <i class="fa-solid fa-plus mr-2" />
                Generate
            </button>
        </div>
    </form>
</div>

<div class="absolute bottom-0 left-2 h-6 w-16">
    {version}
</div>
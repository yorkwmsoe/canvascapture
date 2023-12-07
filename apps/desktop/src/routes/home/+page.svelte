<script lang="ts">
    import { version } from '$app/environment';
</script>

<div class="absolute top-0 w-full p-4 flex justify-between">
    <h1 class="gradient-heading text-xl font-bold">
        Canvas Capture
    </h1>
    <a href="/settings">
        <i class="fa-solid fa-gear text-xl" />
    </a>
</div>

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

<div class="absolute bottom-0 w-full p-4 flex justify-between">
    <div class="font-sm font-light">
        {version}
    </div>
</div>
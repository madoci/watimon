<script lang="ts">
    import OpenPackButton from '#lib/OpenPackButton.svelte';
    import Pack from '#lib/Pack.svelte';
    import { clearStorageData, getCollection } from '#lib/storage-data.ts';

    let packShown = $state(false);
</script>

<div class="h-full w-full">
    <div class="m-auto flex h-full w-full max-w-md flex-col">
        <div class="flex justify-center gap-10">
            <button onclick={() => console.log(getCollection())}>Collection</button>
            <button onclick={() => clearStorageData()}>Reset</button>
        </div>
        <div class="relative h-full w-full">
            {#if !packShown}
                <div class="absolute top-1/2 left-1/2 -translate-1/2">
                    <OpenPackButton
                        renderOpenable={() => 'Ouvrir un booster'}
                        renderUnopenable={(duration) => `Nouveau booster dans ${duration}`}
                        onclick={() => (packShown = !packShown)}
                    />
                </div>
            {:else}
                <Pack onemptied={() => (packShown = false)} />
            {/if}
        </div>
    </div>
</div>

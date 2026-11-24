<script lang="ts">
    import OpenPackButton from '#lib/OpenPackButton.svelte';
    import Pack from '#lib/Pack.svelte';
    import { clearStorageData, getCollection } from '#lib/storage-data.ts';
    import { cubicIn, cubicOut } from 'svelte/easing';
    import { scale } from 'svelte/transition';

    let packShown = $state(false);
</script>

<div class="h-full w-full bg-radial-[circle_at_50%_33%] from-gray-200 to-blue-300">
    <div class="m-auto flex h-full w-full max-w-md flex-col">
        <div class="flex justify-center gap-10">
            <button onclick={() => console.log(getCollection())}>Collection</button>
            <button onclick={() => clearStorageData()}>Reset</button>
        </div>
        <div class="relative flex h-full w-full justify-center">
            {#if !packShown}
                <div
                    in:scale={{ easing: cubicOut, start: 0, opacity: 0 }}
                    out:scale={{ easing: cubicIn, start: 0, opacity: 0 }}
                    class="absolute top-1/2 left-1/2 w-75/100 -translate-1/2"
                >
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

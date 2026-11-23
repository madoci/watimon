<script lang="ts">
    import Pack from '#lib/Pack.svelte';
    import { clearStorageData, getCollection } from '#lib/storage-data.ts';

    let packShown = $state(false);
</script>

<div class="h-full w-full">
    <div class="m-auto flex h-full w-full max-w-md flex-col">
        <button onclick={() => (packShown = !packShown)}>
            {packShown ? 'Return' : 'Open pack'}
        </button>
        <button onclick={() => console.log(getCollection())}>Collection</button>
        <button onclick={() => clearStorageData()}>Reset</button>
        {#if packShown}
            <div class="h-full w-full">
                <Pack onemptied={() => (packShown = false)} />
            </div>
        {/if}
    </div>
</div>

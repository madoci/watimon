<script lang="ts">
    import { ghost } from './pack-animations';
    import { openPack } from './packs';
    import type { CardInfo } from './cards';
    import PackCardPile from './PackCardPile.svelte';
    import PackSelector from './PackSelector.svelte';

    const PACK_SIZE_RATIO = 400 / 731;

    interface PackProps {
        onopened?: () => void;
    }

    let { onopened }: PackProps = $props();

    let isPackOpened = $state(false);
    let cards = $state<CardInfo[]>([]);

    function handleOpen() {
        if (!isPackOpened) {
            isPackOpened = true;
            cards = openPack();
        }
    }
</script>

<div class="relative h-full w-full p-8 perspective-distant">
    {#if !isPackOpened}
        <div
            // Keep pack visible during out transition
            out:ghost|global={{ duration: 1000 }}
            class="z-5 flex h-full w-full"
        >
            <PackSelector onopen={handleOpen} />
        </div>
    {:else}
        <div class="flex h-full w-full">
            <PackCardPile {cards} />
        </div>
    {/if}
</div>

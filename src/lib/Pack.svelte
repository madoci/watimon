<script lang="ts">
    import { ghost } from './pack-animations';
    import { openPack } from './packs';
    import type { CardInfo } from './cards';
    import PackCardPile from './PackCardPile.svelte';
    import PackSelector from './PackSelector.svelte';

    interface PackProps {
        onemptied?: () => void;
    }

    let { onemptied }: PackProps = $props();

    let isPackOpened = $state(false);
    let cards = $state<CardInfo[]>([]);

    function handleOpen() {
        if (!isPackOpened) {
            isPackOpened = true;
            try {
                cards = openPack();
            } catch {
                // If an error occurs while attempting to open a pack, end opening
                onemptied?.();
            }
        }
    }
</script>

<div class="relative h-full w-85/100 perspective-distant">
    {#if !isPackOpened}
        <div
            // Keep pack visible during out transition
            out:ghost|global={{ duration: 1000 }}
            class="z-5 flex h-full w-full"
        >
            <PackSelector onopen={handleOpen} />
        </div>
    {:else}
        <div class="flex h-full w-full justify-center">
            <PackCardPile {cards} {onemptied} />
        </div>
    {/if}
</div>

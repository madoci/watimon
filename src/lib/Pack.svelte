<script lang="ts">
    import { ghost } from './animations/pack-animations';
    import { openPack } from './database/packs';
    import { PACK, type CardInfo } from './database/types';
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
                // For now, there is only one pack
                cards = openPack(PACK.forgottenCurse);
            } catch {
                // If an error occurs while attempting to open a pack, end opening
                onemptied?.();
            }
        }
    }
</script>

<div class="relative flex h-full w-full justify-center perspective-distant">
    <div class="relative h-full w-[279px] sm:w-[372px]">
        {#if !isPackOpened}
            <div
                // Keep pack visible during out transition
                out:ghost={{ duration: 1000 }}
                class="absolute left-1/2 z-5 flex h-full w-[110%] -translate-x-1/2"
            >
                <PackSelector onopen={handleOpen} />
            </div>
        {:else}
            <div class="flex h-full w-full justify-center">
                <PackCardPile {cards} {onemptied} />
            </div>
        {/if}
    </div>
</div>

<script lang="ts">
    import packImage from './assets/pack.png';
    import classnames from './utils/classnames';
    import { crossfade, ghost, whirl } from './pack-animations';
    import PackOpener from './PackOpener.svelte';

    const PACK_SIZE_RATIO = 400 / 731;

    interface PackSelectorProps {
        onopen?: () => void;
    }

    let { onopen }: PackSelectorProps = $props();

    let isOpening = $state(false);
</script>

<div
    in:whirl|global
    class={classnames(
        'm-auto aspect-(--pack-size-ratio) w-full select-none transform-3d',
        isOpening && 'translate-y-[80%] transition-transform duration-1000',
    )}
    style="--pack-size-ratio: {PACK_SIZE_RATIO};"
>
    {#if !isOpening}
        <button
            out:crossfade={{ delayed: true }}
            class="h-full w-full"
            onclick={() => (isOpening = true)}
        >
            <img alt="Card pack" src={packImage} class="h-full w-full" draggable="false" />
        </button>
    {:else}
        <div in:crossfade class="h-full w-full">
            <PackOpener {onopen} />
        </div>
    {/if}
</div>

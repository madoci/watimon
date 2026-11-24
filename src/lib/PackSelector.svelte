<script lang="ts">
    import packImage from './assets/pack.png';
    import classnames from './utils/classnames';
    import { fadeOverlap, whirl } from './animations/pack-animations';
    import PackOpener from './PackOpener.svelte';
    import { HoverTilt } from 'hover-tilt';
    import { resetHoverTilt } from './animations/hover-tilt-animations';

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
        !isOpening && 'scale-75',
        isOpening && 'translate-y-[80%] scale-100 transition-transform duration-1000',
    )}
    style="--pack-size-ratio: {PACK_SIZE_RATIO};"
>
    {#if !isOpening}
        <button
            out:fadeOverlap={{ duration: 300, overlap: 100, delay: 500 }}
            class="h-full w-full [--drop-shadow-opacity:25%]"
            onclick={() => (isOpening = true)}
        >
            <div out:resetHoverTilt={{ duration: 500 }}>
                <HoverTilt
                    tiltFactor={0.75}
                    scaleFactor={1.1}
                    glareIntensity={1}
                    glareMask="url({packImage})"
                    // Shadow prop uses box-shadow which don't work well with transparent images.
                    // The pack shadow uses drop-shadow by using some of hover-tilt CSS variables.
                    class="hover-tilt-drop-shadow"
                    shadowBlur={24}
                >
                    <img alt="Card pack" src={packImage} class="h-full w-full" draggable="false" />
                </HoverTilt>
            </div>
        </button>
    {:else}
        <div in:fadeOverlap={{ duration: 0, overlap: 300, delay: 500 }} class="h-full w-full">
            <PackOpener {onopen} />
        </div>
    {/if}
</div>

<style>
    :global(.hover-tilt-drop-shadow) {
        --shadow-blur: calc(var(--hover-tilt-shadow-blur, 12) * 1px);
        filter: drop-shadow(
            calc(var(--shadow-x) * var(--shadow-blur))
                calc(var(--shadow-y) * var(--shadow-blur) / 2 + var(--shadow-blur) / 4)
                calc(var(--shadow-blur) / 2)
                var(
                    --tw-drop-shadow-color,
                    oklab(from rgb(0 0 0 / 0.15) l a b / var(--drop-shadow-opacity))
                )
        );
    }
</style>

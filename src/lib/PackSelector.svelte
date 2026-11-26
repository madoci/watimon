<script lang="ts">
    import packImage from './assets/pack.png';
    import classnames from './utils/classnames';
    import { fadeOverlap, slideDown, whirl } from './animations/pack-animations';
    import PackOpener from './PackOpener.svelte';
    import { HoverTilt } from 'hover-tilt';
    import {
        addHoverTiltGlareClass,
        blockHoverTiltTransform,
        resetHoverTiltTransform,
    } from './animations/hover-tilt-animations';

    const PACK_SIZE_RATIO = 400 / 731;

    const PACK_OPENER_TRANSITION_DELAY = 300;
    const PACK_OPENER_TRANSITION_DURATION = 500;

    interface PackSelectorProps {
        onopen?: () => void;
    }

    let { onopen }: PackSelectorProps = $props();

    let isOpening = $state(false);

    function transitionPackOut(node: HTMLElement) {
        resetHoverTiltTransform(node, { duration: PACK_OPENER_TRANSITION_DELAY });
        return fadeOverlap(node, {
            duration: PACK_OPENER_TRANSITION_DURATION,
            overlap: 100,
            delay: PACK_OPENER_TRANSITION_DELAY,
        });
    }

    function transitionPackOpenerIn(node: HTMLElement) {
        blockHoverTiltTransform(node, { duration: 850 });
        return fadeOverlap(node, {
            duration: 0,
            overlap: PACK_OPENER_TRANSITION_DURATION,
            delay: PACK_OPENER_TRANSITION_DELAY,
        });
    }

    function transitionPackOpenerOut(node: HTMLElement) {
        addHoverTiltGlareClass(node, { class: 'hover-tilt-cropped-pack' });
        resetHoverTiltTransform(node, { duration: 1800 });
        return slideDown(node);
    }
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
            out:transitionPackOut
            class="h-full w-full [--drop-shadow-opacity:25%]"
            onclick={() => (isOpening = true)}
        >
            <HoverTilt
                tiltFactor={0.75}
                scaleFactor={1.1}
                springOptions={{ stiffness: 0.05, damping: 0.2 }}
                tiltSpringOptions={{ stiffness: 0.05, damping: 0.1 }}
                glareMask="url({packImage})"
                // Shadow prop uses box-shadow which don't work well with transparent images.
                // The pack shadow uses drop-shadow by using some of hover-tilt CSS variables.
                class="hover-tilt-overlayed hover-tilt-luminance-beam hover-tilt-drop-shadow"
                shadowBlur={24}
            >
                <img alt="Card pack" src={packImage} class="h-full w-full" draggable="false" />
            </HoverTilt>
        </button>
    {:else}
        <div in:transitionPackOpenerIn out:transitionPackOpenerOut|global class="h-full w-full">
            <HoverTilt
                tiltFactor={0.1}
                springOptions={{ stiffness: 0.05, damping: 0.2 }}
                tiltSpringOptions={{ stiffness: 0.05, damping: 0.1 }}
                glareIntensity={0.5}
                glareMask="url({packImage})"
                class="hover-tilt-overlayed hover-tilt-luminance-beam"
            >
                <PackOpener {onopen} />
            </HoverTilt>
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

    :global(.hover-tilt-overlayed > .hover-tilt::before) {
        z-index: 10;
        opacity: var(--hover-tilt-custom-glare-opacity, var(--hover-tilt-opacity));
        transition: var(--hover-tilt-custom-glare-transition, 'none');
    }

    :global(.hover-tilt-overlayed > .hover-tilt.hover-tilt-cropped-pack::before) {
        /* This crops out the top part of the glare effect to follow the pack slicing effect */
        top: 5%;
    }

    :global(.hover-tilt-luminance-beam) {
        --hover-tilt-custom-gradient:
            linear-gradient(
                120deg,
                transparent calc((var(--gradient-x, 50%) / 2 + var(--gradient-y, 50%) / 2) - 90%),
                rgb(153 255 250 / calc(var(--hover-tilt-glare-intensity, 1) / 4))
                    calc((var(--gradient-x, 50%) / 2 + var(--gradient-y, 50%) / 2) - 80%),
                transparent calc((var(--gradient-x, 50%) / 2 + var(--gradient-y, 50%) / 2) - 70%),
                transparent calc((var(--gradient-x, 50%) / 2 + var(--gradient-y, 50%) / 2) - 60%),
                rgb(173 249 245 / calc(var(--hover-tilt-glare-intensity, 1) * 0.8))
                    calc((var(--gradient-x, 50%) / 2 + var(--gradient-y, 50%) / 2) + 0%),
                transparent calc((var(--gradient-x, 50%) / 2 + var(--gradient-y, 50%) / 2) + 60%),
                transparent calc((var(--gradient-x, 50%) / 2 + var(--gradient-y, 50%) / 2) + 70%),
                rgb(153 255 250 / calc(var(--hover-tilt-glare-intensity, 1) / 4))
                    calc((var(--gradient-x, 50%) / 2 + var(--gradient-y, 50%) / 2) + 80%),
                transparent calc((var(--gradient-x, 50%) / 2 + var(--gradient-y, 50%) / 2) + 90%)
            ),
            radial-gradient(
                farthest-corner circle at var(--gradient-x) var(--gradient-y),
                lch(
                        95% 2.7 var(--hover-tilt-glare-hue, 270) /
                            calc(var(--hover-tilt-glare-intensity, 1) * 0.66 / 2)
                    )
                    8%,
                lch(
                        90% 5.5 var(--hover-tilt-glare-hue, 270) /
                            calc(var(--hover-tilt-glare-intensity, 1) * 0.5 / 2)
                    )
                    28%,
                lch(
                        75% 3.5 var(--hover-tilt-glare-hue, 270) /
                            calc(var(--hover-tilt-glare-intensity, 1) * 0.25 / 2)
                    )
                    90%
            );
    }
</style>

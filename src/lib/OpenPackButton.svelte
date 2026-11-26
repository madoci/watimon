<script lang="ts">
    import { onMount } from 'svelte';
    import { getRemainingTime } from './database/packs';
    import { getTimeTick } from './time-tick.svelte';
    import { scale } from 'svelte/transition';

    const SHARED_STYLE =
        'rounded-full border-4 border-white bg-linear-120 from-blue-400 via-cyan-300 to-blue-400 bg-size-[400%_100%] shadow-md';

    interface OpenPackButtonProps {
        renderOpenable: () => string;
        renderUnopenable: (formattedDuration: string) => string;
        onclick?: () => void;
    }

    const formatter = new Intl.DurationFormat('fr-FR', { style: 'digital', hours: '2-digit' });

    let { renderOpenable, renderUnopenable, onclick }: OpenPackButtonProps = $props();

    let isLoaded = $state(false);
    let value = $derived(getRemainingTime(getTimeTick()));

    // Svelte build an initial HTML file with some mocked values.
    // In this case, we don't want it to choose the openable not the unopenable text at launch.
    // This code makes Svelte build an HTML file with another content that will be replaced immediatly.
    onMount(() => {
        isLoaded = true;
    });
</script>

{#if !isLoaded}
    <div
        out:scale
        class="{SHARED_STYLE} loading-animation absolute top-1/2 left-1/2 w-2/3 -translate-1/2 p-1"
    ></div>
{:else}
    <button
        in:scale
        class="{SHARED_STYLE} button-animation w-full cursor-pointer p-4 text-xl font-bold text-white select-none text-shadow-md disabled:cursor-default"
        disabled={value >= 0}
        {onclick}
    >
        {value >= 0 ? renderUnopenable(formatter.format({ seconds: value })) : renderOpenable()}
    </button>
{/if}

<style>
    .button-animation {
        animation: gradient-pan 12s ease infinite;
    }

    .loading-animation {
        animation: gradient-pan 2s linear infinite;
    }

    @keyframes gradient-pan {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
</style>
